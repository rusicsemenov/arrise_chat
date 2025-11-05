import http from 'node:http';
import cors from 'cors';
import express from 'express';
import {WebSocketServer} from 'ws';

const app = express();
app.use(cors());

const server = http.createServer(app);

const wss = new WebSocketServer({ server }); // WS "вешается" на тот же сервер

wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`✅ Client connected: ${ip}`);

    ws.send(JSON.stringify({ type: 'WELCOME', msg: 'Hello from WS server!' }));

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
            console.log('📩 Received:', msg);

            if (msg.type === 'PING') {
                ws.send(JSON.stringify({ type: 'PONG', ts: Date.now() }));
            }

            if (msg.type === 'MESSAGE') {
                for (const client of wss.clients) {
                    if (client.readyState === ws.OPEN) {
                        client.send(
                            JSON.stringify({ from: ip, text: msg.text }),
                        );
                    }
                }
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
server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
);
