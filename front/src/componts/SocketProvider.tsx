import { createContext, ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { TDefaultComponentProps } from '../types/default.types.ts';
import { ToastContainer } from 'react-toastify';
import { sagaMiddleware } from '../store/store.ts';
import { WSClient } from '../classes/WSClient.ts';

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
        return (
            <div className="h100 flex justify-center align-center">Waiting for connection...</div>
        );
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
            <ToastContainer />
        </SocketContext.Provider>
    );
};

export type TWSClient = InstanceType<typeof WSClient>;
