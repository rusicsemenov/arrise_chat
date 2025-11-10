import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { MessageController } from './classes/messageController';
import { UsersCollector } from './classes/usersColtroller';
import type { Room } from '@types';

export type Dbs = {
    messagesDB: MessageController;
    usersDB: UsersCollector;
    roomsDB: Low<{ rooms: Room[] }>;
};

export async function initDB(): Promise<Dbs> {
    const messagesDB = new MessageController();
    await messagesDB.readDB();

    const usersDB = new UsersCollector();
    await usersDB.readDB();

    const roomsDB = new Low<{ rooms: Room[] }>(new JSONFile('./db/db_rooms.json'), { rooms: [] });
    await roomsDB.read();

    return { messagesDB, usersDB, roomsDB };
}
