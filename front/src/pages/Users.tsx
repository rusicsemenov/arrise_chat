import { useSocketContext } from '../componts/SocketProvider.tsx';
import { useEffect } from 'react';

const Users = () => {
    const { wsClient } = useSocketContext();

    useEffect(() => {
        wsClient?.send('MESSAGE', { type: 'GET_USERS' });
    }, [wsClient]);

    return <div>Users Component</div>;
};

export default Users;
