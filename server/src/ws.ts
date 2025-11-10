import { WebSocketServer } from 'ws';
import { Server } from 'node:http';
import { v4 as uuidv4 } from 'uuid';
import type { Message, RoomData, SanitizedUser } from '@types';
import type { Dbs } from './db';

export function setupWebSocket(server: Server, dbs: Dbs) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws, req) => {

        // Helper function to broadcast data to all connected clients
        function sendToAllClients(data: any) {
            const message = JSON.stringify(data);
            for (const client of wss.clients) {
                if (client.readyState === ws.OPEN) {
                    client.send(message);
                }
            }
        }

        const ip = req.socket.remoteAddress;
        console.log(`✅ Client connected: ${ip}`);

        ws.send(JSON.stringify({ type: 'WELCOME', msg: 'Hello from WS server!' }));

        ws.on('message', async (raw) => {
            try {
                let jsonString;
                if (Buffer.isBuffer(raw)) {
                    jsonString = raw.toString('utf8');
                } else if (typeof raw === 'string') {
                    jsonString = raw;
                } else {
                    console.error('Unknown message type:', typeof raw);
                    return;
                }

                if (!jsonString) {
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
                        sendToAllClients({ type: 'NEW_MESSAGE', message: newMessage });
                        dbs.messagesDB?.saveMessage(newMessage);
                        break;
                    }

                    case 'JOIN_ROOM': {
                        const newMessage: Message = {
                            id: uuidv4(),
                            roomId: msg.roomId,
                            senderId: 'system',
                            content: `${msg.userName} has joined the room!`,
                            sentAt: new Date().toLocaleString('en-US'),
                            userName: 'System',
                            type: 'SYSTEM',
                        };
                        sendToAllClients({ type: 'NEW_MESSAGE', message: newMessage });
                        dbs.messagesDB?.saveMessage(newMessage);
                        break;
                    }

                    case 'LOGIN': {
                        const { name, password } = msg;
                        let sanitizedUser: SanitizedUser | null = null;

                        const user = dbs.usersDB.findUserByName(name);
                        const verifiedUser =
                            user && (await dbs.usersDB.isVerifiedUser(user, password));

                        if (user && verifiedUser) {
                            sanitizedUser = { id: user.id, name: user.name, token: uuidv4() };
                        } else if (!user) {
                            const newUser = dbs.usersDB.addUser(name, password);
                            if (!newUser) {
                                ws.send(
                                    JSON.stringify({
                                        type: 'ERROR',
                                        message: 'Failed to create new user',
                                    }),
                                );
                                return;
                            }
                            sanitizedUser = { id: newUser.id, name: newUser.name, token: uuidv4() };
                        }

                        ws.send(
                            JSON.stringify(
                                sanitizedUser
                                    ? { type: 'AUTH_RESULT', userData: sanitizedUser }
                                    : { type: 'ERROR', message: 'Invalid credentials' },
                            ),
                        );
                        break;
                    }

                    case 'GET_ROOM_DATA': {
                        const { roomId } = msg;
                        const roomMessages = dbs.messagesDB?.data[roomId] || [];
                        const room = dbs.roomsDB?.data.rooms.find((r) => r.id === roomId);
                        const roomData: RoomData = {
                            roomId,
                            messages: roomMessages,
                            name: room?.name || 'Unknown Room',
                            description: room?.description || '',
                        };
                        ws.send(JSON.stringify({ type: 'ROOM_DATA', ...roomData }));
                        break;
                    }

                    case 'GET_ROOMS':
                        ws.send(
                            JSON.stringify({ type: 'GET_ROOMS', rooms: dbs.roomsDB?.data.rooms }),
                        );
                        break;

                    case 'CREATE_ROOM': {
                        const { name, description } = msg.payload;
                        const newRoom = {
                            id: uuidv4(),
                            name,
                            description,
                            createdAt: new Date().toLocaleString('en-US'),
                            members: [],
                        };
                        dbs.roomsDB?.data.rooms.push(newRoom);
                        await dbs.roomsDB?.write();
                        sendToAllClients({ type: 'ROOM_CREATED', room: newRoom });
                        break;
                    }

                    case 'DELETE_ROOMS': {
                        const { roomId } = msg;
                        if (!dbs.roomsDB) break;
                        const idx = dbs.roomsDB.data.rooms.findIndex((r) => r.id === roomId);
                        if (idx === -1) {
                            ws.send(JSON.stringify({ type: 'ERROR', message: 'Room not found' }));
                            break;
                        }
                        dbs.roomsDB.data.rooms.splice(idx, 1);
                        await dbs.roomsDB.write();
                        sendToAllClients({ type: 'ROOM_DELETED', roomId });
                        break;
                    }

                    case 'GET_USERS':
                        ws.send(JSON.stringify({ type: 'USERS_LIST', users: dbs.usersDB?.data }));
                        break;

                    default:
                        console.warn('Unknown message type:', msg.type);
                }
            } catch (e) {
                console.error('Error processing message:', e);
            }
        });

        ws.on('close', () => console.log(`❌ Client disconnected: ${ip}`));
        ws.on('error', console.error);
    });

    return wss;
}
