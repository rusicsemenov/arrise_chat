import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { initDB } from './db';
import { setupWebSocket } from './ws';

const app = express();
app.use(cors());
app.get('/', (_, res) => res.send('This is an Express server.'));

const server = http.createServer(app);

initDB()
    .then((dbs) => {
        setupWebSocket(server, dbs);
        const PORT = process.env.PORT || 3001;
        server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error('Failed to initialize DBs', err);
        process.exit(1);
    });
