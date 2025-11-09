import { Low } from 'lowdb';
import { User } from '@types';
import bcrypt from 'bcrypt';
import { WrightController } from './wrightController';
import { JSONFile } from 'lowdb/node';
import { v4 as uuidv4 } from 'uuid';

export class UsersCollector {
    usersDB: Low<{ users: User[] }> | null = null;
    private wrightController: WrightController | null = null;

    constructor() {
        this.init();
    }

    get data() {
        return this.usersDB?.data.users || [];
    }

    init() {
        this.usersDB = new Low<{ users: User[] }>(new JSONFile('./db/db_users.json'), {
            users: [],
        });
    }

    async readDB() {
        if (this.usersDB) {
            await this.usersDB.read();
        }
        return this.usersDB;
    }

    findUserByName(name: string): User | null {
        const user = this.usersDB?.data.users.find((u) => u.name === name);
        return user || null;
    }

    addUser(name: string, password: string): User | null {
        if (!this.usersDB) {
            return null;
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const user: User = {
            id: uuidv4(),
            name,
            passwordHash: hash,
            registeredAt: new Date().toLocaleString(),
        };

        this.usersDB.data.users.push(user);
        this.writeDB();
        return user;
    }

    writeDB() {
        if (this.usersDB) {
            if (!this.wrightController) {
                this.wrightController = new WrightController(this.usersDB);
            }
            this.wrightController.write();
        }
    }

    async isVerifiedUser(user: User, password: string): Promise<boolean> {
        return await bcrypt.compare(password, user.passwordHash);
    }
}
