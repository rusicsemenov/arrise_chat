import { ReactElement, useState } from 'react';
import { Link } from 'react-router';
import { useAuthContext } from './AuthProvider.tsx';

const links = [
    { name: 'Home', url: '/' },
    { name: 'Rooms', url: '/rooms' },
    { name: 'Users', url: '/users' },
    { name: 'Room1', url: '/room/1' },
];

export const HamburgerMenu = (): ReactElement | null => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuth, logout } = useAuthContext();

    if (!isAuth) {
        return null;
    }

    return (
        <>
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="hamburger-menu"
                onClick={() => setIsOpen(!isOpen)}
            >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM7 12C7 11.4477 7.44772 11 8 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H8C7.44772 13 7 12.5523 7 12ZM13 18C13 17.4477 13.4477 17 14 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H14C13.4477 19 13 18.5523 13 18Z"
                        fill="currentColor"
                    ></path>
                </g>
            </svg>
            {isOpen && (
                <nav className="menu">
                    <ul>
                        {links.map((link) => (
                            <li key={link.url}>
                                <Link to={link.url}>{link.name}</Link>
                            </li>
                        ))}
                    </ul>
                    <button onClick={logout} className="btn w100">
                        Logout
                    </button>
                </nav>
            )}
        </>
    );
};
