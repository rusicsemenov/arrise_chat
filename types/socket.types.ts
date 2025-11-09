import {Room} from "./room.types";
import {Message} from "./messages.types";
import {SanitizedUser} from "./user.types";

export type Type = 'HELLO' | 'PING' | 'MESSAGE' | (string & {});

export type RoomData =  {
    roomId: Room['id'],
    messages: Message[],
    name: Room['name'],
    description: Room['description'],
}

export type SocketEvent =
    | { type: 'welcome'; payload: { msg: string } }
    | { type: 'pong'; payload: { ts: number } }
    | { type: 'new_message'; payload: { message: Message } }
    | { type: 'room_data'; payload: RoomData }
    | { type: 'room_created'; payload: { room: Room } }
    | { type: 'room_deleted'; payload: { roomId: string } }
    | { type: 'auth_result'; payload: { userData: SanitizedUser } }
    | { type: 'users_list'; payload: { users: SanitizedUser[] } }
    | { type: 'error'; payload: { message: string } }
    | { type: 'connected' }
    | { type: 'disconnected' };
