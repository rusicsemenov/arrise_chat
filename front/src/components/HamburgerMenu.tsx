import { ReactElement, useState } from 'react';
import { Link } from 'react-router';
import { useAuthContext } from './AuthProvider.tsx';
import { ThemeToggle } from './ThemeToggle.tsx';
import { HamburgerIcon } from './HamburgerIcon.tsx';

const links = [
    { name: 'Rooms', url: '/rooms' },
    { name: 'Users', url: '/users' },
];

export const HamburgerMenu = (): ReactElement | null => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuth, logout } = useAuthContext();

    if (!isAuth) {
        return null;
    }

    return (
        <>
            <HamburgerIcon onClick={() => setIsOpen(!isOpen)} />
            {isOpen && (
                <nav className="menu">
                    <ul>
                        {links.map((link) => (
                            <li key={link.url}>
                                <Link to={link.url}>{link.name}</Link>
                            </li>
                        ))}
                        <li>
                            <ThemeToggle />
                        </li>
                    </ul>
                    <div className="menu-footer">
                        <button onClick={logout} className="btn w100">
                            Logout
                        </button>
                    </div>
                </nav>
            )}
        </>
    );
};
