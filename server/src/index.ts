import http from 'node:http';
import cors from 'cors';
import express from 'express';
import { WebSocketServer } from 'ws';

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { Message, Room, RoomData, SanitizedUser } from '@types';
import { MessageController } from '../classes/messageController';
import { UsersCollector } from '../classes/usersColtroller';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());

const server = http.createServer(app);

const wss = new WebSocketServer({ server }); // WS "вешается" на тот же сервер

let messagesDB: MessageController | null = null;
let usersDB: UsersCollector | null = null;
let roomsDB: Low<{ rooms: Room[] }> | null = null;

async function dbActivate() {
    messagesDB = new MessageController();
    await messagesDB.readDB();

    usersDB = new UsersCollector();
    await usersDB.readDB();

    roomsDB = new Low<{ rooms: any[] }>(new JSONFile('./db/db_rooms.json'), {
        rooms: [],
    });
    await roomsDB.read();
}

dbActivate().then(() => {
    wss.on('connection', (ws, req) => {
        const ip = req.socket.remoteAddress;
        console.log(`✅ Client connected: ${ip}`);

        ws.send(
            JSON.stringify({
                type: 'WELCOME',
                msg: 'Hello from WS server!',
            }),
        );

        ws.on('message', async (raw) => {
            try {
                let jsonString;
                if (Buffer.isBuffer(raw)) {
                    jsonString = raw.toString('utf8'); // безопасно для Buffer
                } else if (typeof raw === 'string') {
                    jsonString = raw;
                } else {
                    console.error('Unknown message type:', typeof raw);
                    return;
                }

                const msg = JSON.parse(jsonString);

                switch (msg.type) {
                    case 'HELLO':
                        console.log(`👋 HELLO from ${ip}:`, msg);
                        break;

                    case 'PING':
                        ws.send(JSON.stringify({ type: 'PONG', ts: Date.now() }));
                        break;

                    case 'NEW_MESSAGE': {
                        const newMessage: Message = {
                            id: uuidv4(),
                            roomId: msg.roomId,
                            senderId: msg.senderId,
                            content: msg.content,
                            sentAt: new Date().toLocaleString('en-US'),
                            userName: msg.userName,
                            type: 'USER',
                        };

                        sendToAllClients({
                            type: 'NEW_MESSAGE',
                            message: newMessage,
                        });
                        messagesDB?.saveMessage(newMessage);
                        break;
                    }

                    case 'JOIN_ROOM': {
                        const newMessage: Message = {
                            id: uuidv4(),
                            roomId: msg.roomId,
                            senderId: 'system',
                            content: `${msg.userName} has joined the room! 🎉`,
                            sentAt: new Date().toLocaleString('en-US'),
                            userName: 'System',
                            type: 'SYSTEM',
                        };

                        sendToAllClients({
                            type: 'NEW_MESSAGE',
                            message: newMessage,
                        });
                        messagesDB?.saveMessage(newMessage);
                        break;
                    }

                    case 'LOGIN': {
                        if (!usersDB) {
                            console.error('Users DB not initialized');
                            break;
                        }

                        let sanitizedUser: SanitizedUser | null = null;
                        const { name, password } = msg;
                        console.log(`User login attempt: ${name} / ${password}`);

                        const user = usersDB.findUserByName(name);
                        const verifiedUser = user && (await usersDB.isVerifiedUser(user, password));

                        if (user && verifiedUser) {
                            console.log(`✅ User authenticated: ${name}`);
                            sanitizedUser = {
                                id: user.id,
                                name: user.name,
                                token: uuidv4(),
                            };
                        }

                        if (!user) {
                            console.log(`🆕 Creating new user: ${name}`);
                            const newUser = usersDB.addUser(name, password);

                            if (!newUser) {
                                console.error('Failed to create new user');
                                ws.send(
                                    JSON.stringify({
                                        type: 'ERROR',
                                        message: 'Failed to create new user',
                                    }),
                                );
                                return;
                            }

                            sanitizedUser = {
                                id: newUser.id,
                                name: newUser.name,
                                token: uuidv4(),
                            };
                        }

                        if (sanitizedUser) {
                            ws.send(
                                JSON.stringify({
                                    type: 'AUTH_RESULT',
                                    userData: sanitizedUser,
                                }),
                            );
                        } else {
                            ws.send(
                                JSON.stringify({
                                    type: 'ERROR',
                                    message: 'Invalid credentials',
                                }),
                            );
                        }

                        break;
                    }

                    case 'GET_ROOM_DATA': {
                        const { roomId } = msg;
                        const roomMessages = messagesDB?.data[roomId] || [];
                        const room = roomsDB?.data.rooms.find((room) => room.id === roomId);

                        const roomData: RoomData = {
                            roomId,
                            messages: roomMessages,
                            name: room?.name || 'Unknown Room',
                            description: room?.description || '',
                        };

                        ws.send(
                            JSON.stringify({
                                type: 'ROOM_DATA',
                                ...roomData,
                            }),
                        );
                        break;
                    }

                    case 'GET_ROOMS':
                        ws.send(
                            JSON.stringify({
                                type: 'GET_ROOMS',
                                rooms: roomsDB?.data.rooms,
                            }),
                        );
                        break;

                    case 'CREATE_ROOM': {
                        const { name, description } = msg.payload;
                        const newRoom: Room = {
                            id: uuidv4(),
                            name,
                            description,
                            createdAt: new Date().toLocaleString('en-US'),
                            members: [],
                        };
                        roomsDB?.data.rooms.push(newRoom);
                        await roomsDB?.write();

                        sendToAllClients({
                            type: 'ROOM_CREATED',
                            room: newRoom,
                        });
                        break;
                    }

                    case 'DELETE_ROOMS': {
                        const { roomId } = msg;
                        if (!roomsDB) {
                            console.error('Rooms DB not initialized');
                            break;
                        }

                        const roomIndex = roomsDB.data.rooms.findIndex(
                            (room) => room.id === roomId,
                        );
                        if (roomIndex === -1) {
                            console.warn(`Room not found: ${roomId}`);
                            ws.send(
                                JSON.stringify({
                                    type: 'ERROR',
                                    message: 'Room not found',
                                }),
                            );
                            break;
                        }

                        roomsDB.data.rooms.splice(roomIndex, 1);
                        await roomsDB.write();

                        sendToAllClients({
                            type: 'ROOM_DELETED',
                            roomId,
                        });
                        break;
                    }

                    case 'GET_USERS':
                        ws.send(
                            JSON.stringify({
                                type: 'USERS_LIST',
                                users: usersDB?.data,
                            }),
                        );
                        break;

                    default:
                        console.warn('Unknown message type:', msg.type);
                }
            } catch (e) {
                console.error('Error processing message:', e);
                console.error('Invalid JSON:', JSON.stringify(raw));
            }
        });

        ws.on('close', () => console.log(`❌ Client disconnected: ${ip}`));
        ws.on('error', console.error);

        function sendToAllClients(data: any) {
            const message = JSON.stringify(data);
            for (const client of wss.clients) {
                if (client.readyState === ws.OPEN) {
                    client.send(message);
                }
            }
        }
    });

    app.get('/', (_, res) => {
        res.send('This is an Express server.');
    });

    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
