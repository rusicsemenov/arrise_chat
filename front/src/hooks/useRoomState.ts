import { useEffect, useState } from 'react';
import { Message, RoomData } from '../../../types';
import { useParams } from 'react-router';
import { useSocketContext } from '../componts/SocketProvider.tsx';
import { useAuthContext } from '../componts/AuthProvider.tsx';
import JSConfetti from 'js-confetti';

const jsConfetti = new JSConfetti();

export const useRoomState = () => {
    const params = useParams();
    const { id } = params;

    const { wsClient } = useSocketContext();
    const { userData } = useAuthContext();

    const [messages, setMessages] = useState<Message[]>([]);
    const [roomData, setRoomData] = useState<RoomData | null>(null);

    useEffect(() => {
        if (!wsClient || !id) {
            return;
        }

        wsClient.send('MESSAGE', { type: 'GET_ROOM_DATA', roomId: id });
        wsClient.send('MESSAGE', { type: 'JOIN_ROOM', roomId: id, userName: userData?.name });

        const handleRoomData = (socketRoomData: RoomData) => {
            if (socketRoomData.roomId !== id) {
                return;
            }
            setMessages(socketRoomData.messages);
            setRoomData(socketRoomData);
        };
        wsClient.on('ROOM_DATA', handleRoomData);

        const handleMessageReceive = (msg: { message: Message }) => {
            if (msg.message.roomId !== id) {
                return;
            }

            if (/🎉/.test(msg.message.content)) {
                jsConfetti.addConfetti().then();
            }

            setMessages((prev) => [...prev, msg.message]);
            requestAnimationFrame(scrollToBottom);
        };
        wsClient.on('NEW_MESSAGE', handleMessageReceive);

        return () => {
            wsClient.off('ROOM_DATA', handleRoomData);
            wsClient.off('NEW_MESSAGE', handleMessageReceive);
        };
    }, [wsClient, id]);

    const scrollToBottom = () => {
        const messagesContainer = document.querySelector('.messages .scrollable');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };

    return { messages, roomData };
};
