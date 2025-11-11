import { UserAvatar } from './UserAvatar.tsx';
import { Message } from '../../../types';
import { hashStringToHue } from '../utuls/hashStringToHue.ts';

type RoomMessageType = {
    message: Message;
    currentUserMessage: boolean;
    showUserInfo: boolean;
};

export const RoomMessage = ({
    message,
    currentUserMessage,
    showUserInfo,
}: RoomMessageType) => {
    const { id, type, content, sentAt, userName } = message;
    const time = sentAt.split(',')[1].trim();

    return (
        <div
            key={id}
            className={`msg flex-column p-1 ${type === 'SYSTEM' ? 'system' : ''} ${currentUserMessage ? 'ml-auto text-right' : 'mr-auto '}`}
        >
            {showUserInfo && (
                <span
                    className="user flex gap-1 mb-2"
                    style={{
                        color: `hsl(${hashStringToHue(userName)}, 70%, 50%)`,
                        flexDirection: currentUserMessage ? 'row-reverse' : 'row',
                    }}
                >
                    <UserAvatar userName={userName} />
                    {userName}
                </span>
            )}
            <span className="text">{content}</span>
            <span className="time mt-1">{time}</span>
        </div>
    );
};
