import { TWSClient } from '../../componts/SocketProvider.tsx';
import { call, delay, getContext, take } from 'redux-saga/effects';
import { END, EventChannel, eventChannel } from 'redux-saga';
import { SocketEvent } from '../../../../types';
import { toast } from 'react-toastify';

export function* getSocket(): Generator<any, TWSClient> {
    let wsClient: TWSClient | null = null;

    while (!wsClient) {
        wsClient = yield getContext('wsClient');
        if (!wsClient) {
            console.log('⏳ Waiting for wsClient in context...');
            yield delay(100);
        }
    }

    return wsClient;
}

export function* checkSocket(): Generator<any, boolean> {
    const wsClient = yield* getSocket();
    if (!wsClient) {
        console.warn('⚠️ No WebSocket client available');
        return false;
    }
    console.log('🔍 Checking WebSocket connection status:', wsClient.isConnected());
    return wsClient.isConnected();
}

export function* waitForSocketReady(): Generator<any, TWSClient> {
    console.log('🔌 Waiting for socket to be ready...');

    const socket = yield* getSocket();

    if (!socket) {
        throw new Error('No WebSocket client available');
    }

    if (socket.isConnected()) {
        return socket;
    }

    throw new Error('Socket is not connected');
}

export function createSocketChannel(socket: TWSClient) {
    return eventChannel<SocketEvent>((emit) => {
        const handleRawMessage = (raw: string) => {

            try {
                const data = JSON.parse(raw);
                const type = String(data.type).toLowerCase();

                // make object without type field
                const payload = { ...data };
                delete payload.type;

                emit({ type, payload } as SocketEvent);
            } catch (err) {
                console.error('Invalid WS data', err);
            }
        };

        const handleErrorMessage = (error: { type: string, message: string }) => {
            emit({ type: 'error', payload: { message: error.message } } as SocketEvent);
        };

        const handleHelloMessage = () => {
            emit({ type: 'connected' });
        }

        const handleCloseMessage = () => {
            emit({ type: 'disconnected' });
            emit(END);
        }


        /**
         * we should handle different message types here
         * e.g. NEW_MESSAGE, ROOM_CREATED, ERROR, WELCOME, CLOSE, etc.
         * and emit corresponding SocketEvent objects
         */

        socket.on('NEW_MESSAGE', handleRawMessage);
        // socket.on('GET_ROOMS', handleRawMessage);
        // socket.on('USERS_LIST', handleRawMessage);
        socket.on('ERROR', handleErrorMessage);
        socket.on('WELCOME', handleHelloMessage);
        socket.on('CLOSE', handleCloseMessage);

        return () => {
            socket.off('MESSAGE', handleRawMessage);
            socket.off('ERROR', handleErrorMessage);
            socket.off('WELCOME', handleHelloMessage);
            socket.off('CLOSE', handleCloseMessage);
        };
    });
}

export function* watchSocketEvents() {
    const socket = yield* getSocket();

    if (!socket) {
        console.error('❌ No WebSocket client available');
    }

    const chan: EventChannel<SocketEvent> = yield call(createSocketChannel, socket);

    while (true) {
        const event: SocketEvent = yield take(chan);

        switch (event.type) {
            case 'welcome':
                console.log('✅', event.payload.msg);
                break;
            case 'new_message':
                // we can save message to redux store here if needed
                console.log('💬 New message received:', event.payload.message);
                break;
            case 'room_created':
                // we can update rooms list in redux store here if needed
                console.log('🏠 New room created:', event.payload.room);
                break;
            case 'error':
                console.error('⚠️ WS Error:', event.payload.message);
                yield call(toast, event.payload.message, { type: 'error' });
                break;
            case 'disconnected':
                console.warn('🔴 WS disconnected');
                break;
        }
    }
}
