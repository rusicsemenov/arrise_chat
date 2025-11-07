import { Link, useParams } from 'react-router';
import { useSocketContext } from '../componts/SocketProvider.tsx';
import { FormEvent, useEffect, useRef } from 'react';
import { Message } from '../../../types';
import JSConfetti from 'js-confetti';

const jsConfetti = new JSConfetti();

/**
 * export type Message = {
 *     id: string;
 *     roomId: string;
 *     senderId: string;
 *     content: string;
 *     sentAt: string;
 *     type: MessageType
 * }
 */

const msg: Message[] = [
    {
        id: '1',
        roomId: '1',
        senderId: 'system',
        content: 'Welcome to the room!',
        sentAt: new Date().toISOString(),
        type: 'SYSTEM',
    },
    {
        id: '2',
        roomId: '1',
        senderId: 'user1',
        content: 'Hello everyone!',
        sentAt: new Date().toISOString(),
        type: 'USER',
    },
    {
        id: '3',
        roomId: '1',
        senderId: 'user2',
        content: 'Hi user1!',
        sentAt: new Date().toISOString(),
        type: 'USER',
    },
    {
        roomId: '1',
        senderId: '0',
        content: 'User connected: ::1',
        type: 'SYSTEM',
        id: '3ed02002-9daa-4d52-bce8-2e6b327ea73f',
        sentAt: '2025-11-06T22:20:44.816Z',
    },
    {
        roomId: '1',
        senderId: '0',
        content: 'User connected: ::1',
        type: 'SYSTEM',
        id: 'bce261d3-dca9-4cb6-942f-7659bf5fb462',
        sentAt: '2025-11-06T22:20:56.335Z',
    },
    {
        roomId: '1',
        senderId: '0',
        content: 'User connected: ::1',
        type: 'SYSTEM',
        id: '2cdffce8-6ebf-49dc-9544-c648c410fd24',
        sentAt: '2025-11-06T22:22:57.555Z',
    },
];

const Room = () => {
    const params = useParams();
    const { id } = params;
    const { wsClient } = useSocketContext();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        wsClient?.send('MESSAGE', { type: 'GET_ROOM_DATA', roomId: id });
        inputRef.current?.focus();
    }, [wsClient, id]);

    const showConfetti = () => {
        jsConfetti.addConfetti().then();
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        showConfetti();

        const message = inputRef.current?.value;
        if (!message) return;

        wsClient?.send('MESSAGE', {
            type: 'NEW_MESSAGE',
            roomId: id,
            senderId: 'user123',
            content: message,
        });

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className="card room flex1 flex-column gap-2">
            <div className="flex gap-2">
                <h1>Room: {id}</h1>
                <Link to="/rooms" className="btn ml-auto secondary">
                    back to rooms
                </Link>
            </div>
            <div className="messages flex flex-1 w100">
                <div className="scrollable flex-column gap-1 w100">
                    {msg.map(({ id, type, content, sentAt, senderId }) => (
                        <div key={id} className={`msg ${type === 'SYSTEM' ? 'system' : ''}`}>
                            <span className="user">{senderId}</span>
                            <span className="text">{content}</span>
                            <span className="ts">{sentAt}</span>
                        </div>
                    ))}
                </div>
            </div>
            <form className="footer flex gap-2" onSubmit={onSubmit}>
                <input
                    type="text"
                    className="w100"
                    placeholder="Type your message..."
                    ref={inputRef}
                />
                <button onClick={showConfetti} className="btn">
                    Send
                </button>
            </form>
        </div>
    );
};

export default Room;
