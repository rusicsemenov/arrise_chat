import http from 'node:http';
import path from 'node:path';
import express from 'express';

const app = express();

const distPath = path.join(path.dirname(new URL(import.meta.url).pathname), 'dist');

app.use(express.static(distPath));

app.get('/', (_, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
