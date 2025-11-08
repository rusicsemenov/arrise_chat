import {Room} from "./room.types";
import {Message} from "./messages.types";

export type Type = 'HELLO' | 'PING' | 'MESSAGE' | (string & {});

export type RoomData =  {
    roomId: Room['id'],
    messages: Message[],
    name: Room['name'],
    description: Room['description'],
}
