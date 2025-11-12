import { Link } from 'react-router';
import { Room } from '../../../types';

type RoomCardProps = {
    room: Room;
    deleteRoom: (roomId: string) => void;
};

export const RoomCard = ({ room, deleteRoom }: RoomCardProps) => (
    <li className="card w100">
        <div className="flex gap-2 align-center">
            <h2>{room.name}</h2>
            <button className="btn ml-auto danger" onClick={() => deleteRoom(room.id)}>
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
);
