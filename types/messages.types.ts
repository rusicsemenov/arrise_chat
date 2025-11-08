export type Message = {
    id: string;
    roomId: string;
    senderId: string;
    content: string;
    sentAt: string;
    userName: string;
    type: MessageType
}

export type MessageType = 'USER' | 'SYSTEM' | (string & {});

export type MessageHandler = (data: any) => void;
