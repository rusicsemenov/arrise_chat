import { createContext, ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { TDefaultComponentProps } from '../types/default.types.ts';
import { MessageHandler, Type } from '../../../types';
import { ToastContainer } from 'react-toastify';
import { sagaMiddleware } from '../store/store.ts';

class WSClient {
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
    const wsClient = useMemo<TWSClient>(() => new WSClient('ws://localhost:3001'), []);
    const [isActive, setIsActive] = useState(wsClient.isConnected());

    useEffect(() => {
        if (!wsClient) {
            return;
        }

        sagaMiddleware.setContext({ wsClient });
    }, [wsClient]);

    useEffect(() => {
        if (!isActive) {
            const interval = setInterval(() => {
                setIsActive(wsClient?.isConnected());
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isActive, wsClient]);

    const value = useMemo(() => ({ wsClient }), [wsClient]);

    if (!wsClient || !isActive) {
        return <div className="h100 flex justify-center align-center">Waiting for connection...</div>;
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
            <ToastContainer />
        </SocketContext.Provider>
    );
};

export type TWSClient = InstanceType<typeof WSClient>;
