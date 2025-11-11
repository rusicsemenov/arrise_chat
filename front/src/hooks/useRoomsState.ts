import { useEffect, useState } from 'react';
import { Room } from '../../../types';
import { useSocketContext } from '../componts/SocketProvider.tsx';

export const useRoomsState = () => {
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

    return { rooms, deleteRoom };
};
