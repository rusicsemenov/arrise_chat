export type User = {
    id: string;
    name: string;
    email?: string;
    passwordHash: string;
    registeredAt: string;
    token?: string;
}
