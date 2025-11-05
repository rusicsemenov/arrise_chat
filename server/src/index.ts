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
        console.log(messagesDB?.data);
        console.log(usersDB?.data.users);
        console.log(roomsDB?.data.rooms);
    })
    .catch(console.error);

wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`✅ Client connected: ${ip}`);

    ws.send(
        JSON.stringify({
            type: 'WELCOME',
            msg: 'Hello from WS server!',
            messages: messagesDB?.data,
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

            if (msg.type === 'PING') {
                ws.send(JSON.stringify({ type: 'PONG', ts: Date.now() }));
            }

            if (msg.type === 'MESSAGE') {
                for (const client of wss.clients) {
                    if (client.readyState === ws.OPEN) {
                        client.send(JSON.stringify({ from: ip, text: msg.text }));
                    }
                }

                messagesDB?.saveMessage({
                    roomId: '1',
                    senderId: '1',
                    content: msg.text,
                    type: 'USER',
                });
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
