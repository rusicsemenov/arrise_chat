import { MessageHandler, Type } from '../../../types';

export class WSClient {
    private readonly url: string;
    private reconnectAttempts: number = 0;
    private readonly maxReconnect: number = 10;
    private pingInterval: NodeJS.Timeout | null = null;
    private ws: WebSocket | null = null;
    private listeners: Record<string, Set<MessageHandler>> = {};

    constructor(url: string) {
        this.url = url;
        this.connect();
    }

    connect() {
        console.log('🔌 Connecting to', this.url);
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log('✅ Connected');
            this.reconnectAttempts = 0;
            this.send('HELLO', { client: 'browser', user: 'guest' });
            this.startPing();
        };

        this.ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                this.dispatch(msg.type, msg);
                console.log('📩', msg);
            } catch {
                console.log('📩 Raw message:', event.data);
            }
        };

        this.ws.onclose = () => {
            console.warn('🔴 Connection closed');
            this.stopPing();
            this.scheduleReconnect();
        };

        this.ws.onerror = (err) => {
            console.error('⚠️ WebSocket error', err);
            this.ws?.close();
        };
    }

    send(type: Type, payload = {}) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, ...payload }));
        }
    }

    startPing() {
        this.pingInterval = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.send('PING', { ts: Date.now() });
            }
        }, 10000);
    }

    stopPing() {
        this.pingInterval && clearInterval(this.pingInterval);
    }

    on(type: string, handler: MessageHandler) {
        if (!this.listeners[type]) this.listeners[type] = new Set();
        this.listeners[type].add(handler);
    }

    off(type: string, handler: MessageHandler) {
        this.listeners[type]?.delete(handler);
    }

    scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnect) {
            console.error('❌ Too many reconnect attempts');
            return;
        }

        const timeout = Math.min(1000 * 2 ** this.reconnectAttempts, 15000);
        console.log(`🔁 Reconnecting in ${timeout / 1000}s`);
        this.reconnectAttempts++;

        setTimeout(() => this.connect(), timeout);
    }

    isConnected() {
        return this.ws?.readyState === WebSocket.OPEN;
    }

    private dispatch(type: string, data: any) {
        if (!this.listeners[type]) {
            return;
        }

        for (const handler of this.listeners[type]) {
            handler(data);
        }
    }
}
