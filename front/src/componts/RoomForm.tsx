import { FormEvent, MouseEvent, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useAuthContext } from './AuthProvider.tsx';
import { useSocketContext } from './SocketProvider.tsx';
import { useParams } from 'react-router';

export const RoomForm = () => {
    const { wsClient } = useSocketContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const { userData } = useAuthContext();
    const params = useParams();
    const { id } = params;

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [])

    const addConfettiSymbol = (e: MouseEvent) => {
        e.preventDefault();
        if (inputRef.current) {
            inputRef.current.value += ' 🎉';
            inputRef.current.focus();
        }
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();

        const message = inputRef.current?.value.trim();

        if (!message) {
            return;
        }

        if (message.length > 200) {
            toast('Message must be less than 200 characters', { type: 'error' });
            return;
        }

        wsClient?.send('MESSAGE', {
            type: 'NEW_MESSAGE',
            roomId: id,
            senderId: userData?.id || 'unknown',
            userName: userData?.name || 'Unknown',
            content: message,
        });

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return <form className="footer flex gap-2" onSubmit={onSubmit}>
        <input
            type="text"
            className="w100"
            placeholder="Type your message..."
            ref={inputRef}
        />
        <button type="submit" className="btn">
            Send
        </button>
        <button className="btn secondary flex" onClick={addConfettiSymbol} tabIndex={-1}>
            add 🎉
        </button>
    </form>
}
