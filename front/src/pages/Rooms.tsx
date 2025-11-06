import { useSocketContext } from '../componts/SocketProvider.tsx';
import { useEffect } from 'react';

const Rooms = () => {
    const { wsClient } = useSocketContext();

    useEffect(() => {
        wsClient?.send('MESSAGE', { type: 'GET_ROOMS' });
    }, [wsClient]);

    return <div>Rooms Component</div>;
};

export default Rooms;
