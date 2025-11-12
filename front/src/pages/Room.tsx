import { Link } from 'react-router';
import { useRef } from 'react';
import { useAuthContext } from '../components/AuthProvider.tsx';
import { RoomMessage } from '../components/RoomMessage.tsx';
import { RoomForm } from '../components/RoomForm.tsx';
import { useRoomState } from '../hooks/useRoomState';

const Room = () => {
    const { userData } = useAuthContext();
    const { messages, roomData } = useRoomState();

    const previousMessageDay = useRef<string | null>(null);
    const previousMessageSenderId = useRef<string | null>(null);

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
                    {Boolean(messages.length === 0) && (
                        <div className="text-center w100 mt-2">
                            No messages yet. Start the conversation!
                        </div>
                    )}

                    {messages.map((message) => {
                        const { id, sentAt, senderId } = message;
                        const currentDay = sentAt.split(',')[0];
                        const showDateSeparator = previousMessageDay.current !== currentDay;
                        const showUserInfo = previousMessageSenderId.current !== senderId;
                        const currentUserMessage = senderId === userData?.id;

                        previousMessageSenderId.current = senderId || 'unknown';
                        previousMessageDay.current = currentDay;

                        return (
                            <>
                                {showDateSeparator ? (
                                    <div key={id + '-date-sep'} className="text-center">
                                        {currentDay}
                                    </div>
                                ) : null}

                                <RoomMessage
                                    key={id}
                                    message={message}
                                    currentUserMessage={currentUserMessage}
                                    showUserInfo={showUserInfo}
                                />
                            </>
                        );
                    })}
                </div>
            </div>
            <RoomForm />
        </div>
    );
};

export default Room;
