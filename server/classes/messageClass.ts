import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { Message } from '@types';
import { WrightController } from './wrightController';
import { v4 as uuidv4 } from 'uuid';

type MessageRecord = Record<string, Message[]>;

const MESSAGE_LIMIT = 20;
const defaultMessagesData: MessageRecord = {};

export class MessageClass {
    public messagesDB: Low<MessageRecord> | null = null;
    private wrightController: WrightController | null = null;

    constructor() {
        this.init();
    }

    get data() {
        return this.messagesDB?.data || defaultMessagesData;
    }

    getLastTwentyMessages(roomId: string): Message[] {
        if (this.messagesDB?.data[roomId]) {
            const messages = this.messagesDB.data[roomId];
            return messages.slice(-MESSAGE_LIMIT);
        }
        return [];
    }

    init() {
        this.messagesDB = new Low<MessageRecord>(
            new JSONFile('./db/db_messages.json'),
            defaultMessagesData,
        );
    }

    async readDB() {
        if (this.messagesDB) {
            await this.messagesDB.read();
        }
        console.log(this.messagesDB);
        return this.messagesDB;
    }

    writeDB() {
        if (this.messagesDB) {
            if (!this.wrightController) {
                this.wrightController = new WrightController(this.messagesDB);
            }

            this.wrightController.write();
        }
    }

    saveMessage(msg: Omit<Message, 'id' | 'sentAt'>) {
        const { roomId } = msg;

        if (!this.messagesDB || !roomId) {
            return;
        }

        if (!this.messagesDB.data[roomId]) {
            this.messagesDB.data[roomId] = [];
        }

        this.messagesDB.data[roomId].push(getNewMessage(msg));
        this.messagesDB.data[roomId] = this.getLastTwentyMessages(roomId);
        this.writeDB();
    }
}

function getNewMessage(data: Omit<Message, 'id' | 'sentAt'>): Message {
    return {
        ...data,
        id: uuidv4(),
        sentAt: new Date().toISOString(),
    };
}
