export const UserAvatar = ({ userName }: { userName: string}) => {
    return <svg
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
}
