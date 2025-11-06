import http from 'node:http';
import cors from 'cors';
import express from 'express';
import { WebSocketServer } from 'ws';

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { Room, User } from '@types';
import { MessageClass } from '../classes/messageClass';

const app = express();
app.use(cors());

const server = http.createServer(app);

const wss = new WebSocketServer({ server }); // WS "вешается" на тот же сервер

let messagesDB: MessageClass | null = null;
let usersDB: Low<{ users: User[] }> | null = null;
let roomsDB: Low<{ rooms: Room[] }> | null = null;

async function dbActivate() {
    messagesDB = new MessageClass();
    await messagesDB.readDB();

    usersDB = new Low<{ users: User[] }>(new JSONFile('./db/db_users.json'), {
        users: [],
    });
    await usersDB.read();

    roomsDB = new Low<{ rooms: any[] }>(new JSONFile('./db/db_rooms.json'), {
        rooms: [],
    });
    await roomsDB.read();
}

dbActivate()
    .then(() => {
        // console.log(messagesDB?.data);
        // console.log(usersDB?.data.users);
        // console.log(roomsDB?.data.rooms);
    })
    .catch(console.error);

wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`✅ Client connected: ${ip}`);

    ws.send(
        JSON.stringify({
            type: 'WELCOME',
            msg: 'Hello from WS server!',
        }),
    );

    messagesDB?.saveMessage({
        roomId: '1',
        senderId: '0',
        content: `User connected: ${ip}`,
        type: 'SYSTEM',
    });

    ws.on('message', (raw) => {
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

                case 'NEW_MESSAGE':
                    for (const client of wss.clients) {
                        if (client.readyState === ws.OPEN) {
                            client.send(JSON.stringify({ from: ip, content: msg.content }));
                        }
                    }

                    messagesDB?.saveMessage({
                        roomId: msg.roomId,
                        senderId: msg.senderId,
                        content: msg.content,
                        type: 'USER',
                    });
                    break;

                case 'LOGIN': {
                    const { name, password } = msg;
                    console.log(`User login attempt: ${name} / ${password}`);
                    break;
                }

                case 'GET_ROOM_DATA': {
                    const { roomId } = msg;
                    const roomMessages = messagesDB?.data[roomId] || [];

                    ws.send(
                        JSON.stringify({
                            type: 'ROOM_MESSAGES',
                            roomId,
                            messages: roomMessages,
                            users: usersDB?.data,
                        }),
                    );
                    break;
                }

                case 'GET_ROOMS':
                    ws.send(
                        JSON.stringify({
                            type: 'ROOMS_LIST',
                            rooms: roomsDB?.data.rooms,
                        }),
                    );
                    break;

                case 'GET_USERS':
                    ws.send(
                        JSON.stringify({
                            type: 'USERS_LIST',
                            users: usersDB?.data.users,
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
});

app.get('/', (_, res) => {
    res.send('This is an Express server.');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
