import { useSocketContext } from '../componts/SocketProvider.tsx';
import { useEffect, useState } from 'react';
import { Room } from '../../../types';
import { Link } from 'react-router';
import AddRoom from '../componts/AddRoom.tsx';

const Rooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const { wsClient } = useSocketContext();

    useEffect(() => {
        if (!wsClient) {
            return;
        }

        // Handle room created messages
        const handleCreatedMessage = (msg: { room: Room }) => {
            setRooms((prevRooms) => [...prevRooms, msg.room]);
        };
        wsClient.on('ROOM_CREATED', handleCreatedMessage);

        // Handle room deleted messages
        const handleRoomDeleted = (msg: { roomId: string }) => {
            setRooms((prevRooms) => prevRooms.filter((room) => room.id !== msg.roomId));
        };
        wsClient.on('ROOM_DELETED', handleRoomDeleted);

        // Handle get rooms response
        const handleGetRoom = (msg: { rooms: Room[] }) => {
            console.log('💬 message received:', msg);
            setRooms(msg.rooms);
        };
        wsClient.on('GET_ROOMS', handleGetRoom);
        wsClient.send('MESSAGE', { type: 'GET_ROOMS' });

        // Cleanup listeners on unmount
        return () => {
            wsClient.off('ROOM_CREATED', handleCreatedMessage);
            wsClient.off('GET_ROOMS', handleGetRoom);
            wsClient.off('ROOM_DELETED', handleRoomDeleted);
        };
    }, [wsClient]);

    const deleteRoom = (roomId: string) => {
        const confirmResult = globalThis.confirm(
            'Are you sure you want to delete this room? This action cannot be undone.',
        );

        if (confirmResult) {
            wsClient?.send('MESSAGE', { type: 'DELETE_ROOMS', roomId: roomId });
        }
    };

    return (
        <>
            <div className="flex gap-2 align-center">
                <h1>Rooms</h1>
                <AddRoom />
            </div>
            <ul className="room-list gap-2">
                {rooms.map((room) => (
                    <li key={room.id} className="card w100">
                        <div className="flex gap-2 align-center">
                            <h2>{room.name}</h2>
                            <button
                                className="btn ml-auto danger"
                                onClick={() => deleteRoom(room.id)}
                            >
                                Delete
                            </button>
                        </div>
                        <p>{room.description}</p>
                        <p>Created At: {new Date(room.createdAt).toLocaleString()}</p>
                        <p>Members: {room.members.join(', ')}</p>
                        <Link to={`/room/${room.id}`} className="btn">
                            Join now
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Rooms;
