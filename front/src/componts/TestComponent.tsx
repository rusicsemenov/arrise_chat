import { FormEvent, ReactElement, useRef } from 'react';
import { useSocketContext } from './SocketProvider.tsx';

export const TestComponentProps = (): ReactElement => {
    const messageRef = useRef<HTMLInputElement>(null);
    const { wsClient } = useSocketContext();

    const sendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!messageRef.current) {
            console.error('Message input reference is null');
            return;
        }

        const message = messageRef.current.value;
        if (message) {
            wsClient?.send('MESSAGE', { text: message });
            messageRef.current.value = '';
            messageRef.current.focus();
        } else {
            console.warn('Message is empty');
        }
    };

    return (
        <form onSubmit={sendMessage}>
            Test Component
            <div>
                <label htmlFor="message">Enter your message</label>
                <input name="message" ref={messageRef} />
            </div>
            <button type="submit">Send message</button>
        </form>
    );
};
