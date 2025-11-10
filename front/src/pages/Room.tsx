import { Link, useParams } from 'react-router';
import { useSocketContext } from '../componts/SocketProvider.tsx';
import { FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { Message, RoomData } from '../../../types';
import JSConfetti from 'js-confetti';
import { useAuthContext } from '../componts/AuthProvider.tsx';
import { toast } from 'react-toastify';

const jsConfetti = new JSConfetti();

const hashStringToHue = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (str.codePointAt(i) || 1) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 360);
};

const Room = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const params = useParams();
    const { id } = params;
    const { wsClient } = useSocketContext();
    const { userData } = useAuthContext();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!wsClient || !id) {
            return;
        }

        wsClient.send('MESSAGE', { type: 'GET_ROOM_DATA', roomId: id });
        wsClient.send('MESSAGE', { type: 'JOIN_ROOM', roomId: id, userName: userData?.name });
        inputRef.current?.focus();

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

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();

        const message = inputRef.current?.value.trim();

        console.log('Sending message:', message);
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

    const scrollToBottom = () => {
        const messagesContainer = document.querySelector('.messages .scrollable');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };

    const addConfettiSymbol = (e: MouseEvent) => {
        e.preventDefault();
        if (inputRef.current) {
            inputRef.current.value += ' 🎉';
            inputRef.current.focus();
        }
    };

    let previousMessageDay: string | null = null;
    let showDateSeparator: boolean = false;

    let previousMessageSenderId: string | null = null;
    let showUserInfo: boolean = false;

    let currentDay: string | null = null;
    let time: string | null = null;

    let currentUserMessage = false;

    return (
        <div className="room flex1 flex-column gap-2">
            <div className="flex gap-2 card align-center">
                <div>
                    <h1>{roomData?.name ?? 'Unknown name'}</h1>
                    {roomData?.description ? <p>{roomData?.description}</p> : null}
                </div>
                <Link to="/rooms" className="btn ml-auto">
                    back to rooms
                </Link>
            </div>
            <div className="card messages flex flex1 w100">
                <div className="scrollable flex-column gap-1 w100">
                    {
                        messages.length === 0 ? (
                            <div className="text-center w100 mt-2">
                                No messages yet. Start the conversation!
                            </div>
                        ) : null
                    }

                    {messages.map(({ id, type, content, sentAt, userName, senderId }) => {
                        [currentDay, time] = sentAt.split(',');
                        showDateSeparator = previousMessageDay !== currentDay;
                        previousMessageDay = currentDay;

                        showUserInfo = previousMessageSenderId !== senderId;
                        previousMessageSenderId = senderId || 'unknown';

                        currentUserMessage = senderId === userData?.id;

                        return (
                            <>
                                {showDateSeparator ? (
                                    <div key={id + '-date-sep'} className="text-center">
                                        {previousMessageDay}
                                    </div>
                                ) : null}

                                <div
                                    key={id}
                                    className={`msg flex-column p-1 ${type === 'SYSTEM' ? 'system' : ''} ${currentUserMessage ? 'ml-auto text-right' : 'mr-auto '}`}
                                >
                                    {showUserInfo && (
                                        <span
                                            className="user flex gap-1 mb-2"
                                            style={{
                                                color: `hsl(${hashStringToHue(userName)}, 70%, 30%)`,
                                                flexDirection: currentUserMessage
                                                    ? 'row-reverse'
                                                    : 'row',
                                            }}
                                        >
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    fill="currentColor"
                                                />
                                                <text
                                                    x="12"
                                                    y="16"
                                                    textAnchor="middle"
                                                    fontSize="12"
                                                    fill="#ffffff"
                                                    fontFamily="Arial, sans-serif"
                                                >
                                                    {userName.charAt(0).toUpperCase()}
                                                </text>
                                            </svg>
                                            {userName}
                                        </span>
                                    )}
                                    <span className="text">{content}</span>
                                    <span className="time mt-1">{time}</span>
                                </div>
                            </>
                        );
                    })}
                </div>
            </div>
            <form className="footer flex gap-2" onSubmit={onSubmit}>
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
        </div>
    );
};

export default Room;
