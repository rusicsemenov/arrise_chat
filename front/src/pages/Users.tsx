import { useSocketContext } from '../componts/SocketProvider.tsx';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store.ts';
import { getUsersState } from '../store/users/user.selectors.ts';
import { User } from '../../../types';
import { setUsers } from '../store/users/users.reducer.ts';

const Users = () => {
    const { wsClient } = useSocketContext();

    const dispatch = useAppDispatch();
    const usersState = useAppSelector(getUsersState);

    useEffect(() => {
        if (!wsClient) {
            return;
        }

        wsClient?.send('MESSAGE', { type: 'GET_USERS' });

        const handleUsersGet = (msg: { users: User[] }) => {
            dispatch(setUsers(msg.users));
        };

        wsClient?.on('USERS_LIST', handleUsersGet);

        return () => {
            wsClient?.off('USERS_LIST', handleUsersGet);
        };
    }, [wsClient]);

    return (
        <div className="card">
            <h1 className="mb-2">Users lest in the DB</h1>
            <table className="w100 table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Registered at</th>
                    </tr>
                </thead>
                <tbody>
                    {usersState.users?.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.registeredAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
