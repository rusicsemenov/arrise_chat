import AddRoom from '../components/AddRoom.tsx';
import { useAuthContext } from '../components/AuthProvider.tsx';
import { useRoomsState } from '../hooks/useRoomsState';
import { RoomCard } from '../components/RoomCard.tsx';

const Rooms = () => {
    const { userData } = useAuthContext();
    const { rooms, deleteRoom } = useRoomsState();

    return (
        <>
            <div className="flex gap-2 align-center card">
                <h1>Welcome to the rooms {userData?.name}</h1>
                <AddRoom />
            </div>
            <ul className="room-list gap-2">
                {rooms.map((room) => (
                    <RoomCard room={room} key={room.id} deleteRoom={deleteRoom} />
                ))}
            </ul>
        </>
    );
};

export default Rooms;
