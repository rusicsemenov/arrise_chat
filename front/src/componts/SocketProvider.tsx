import { createContext, ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { TDefaultComponentProps } from '../types/default.types.ts';
import { Type } from '../../../types';

class WSClient {
    private readonly url: string;
    private reconnectAttempts: number = 0;
    private readonly maxReconnect: number = 10;
    private pingInterval: NodeJS.Timeout | null = null;
    private ws: WebSocket | null = null;

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

            // отправляем "HELLO" при каждом новом подключении
            this.send('HELLO', { client: 'browser', user: 'guest' });

            // запускаем ping
            this.startPing();
        };

        this.ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
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
}

// create context

type TSocketContext = {
    wsClient: WSClient | null;
};

const SocketContext = createContext<TSocketContext>({ wsClient: null });
export const useSocketContext = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocketContext must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }: TDefaultComponentProps): ReactElement => {
    const [wsClient, setWsClient] = useState<WSClient | null>(null);

    useEffect(() => {
        const client = new WSClient('ws://localhost:3001');
        setWsClient(client);
    }, []);

    const value = useMemo(() => ({ wsClient }), [wsClient]);

    if (!wsClient) {
        return <div>Connection...</div>;
    }

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
