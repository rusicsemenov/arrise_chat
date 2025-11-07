import { RiveAnimation } from './RiveAnimation.tsx';
import { Outlet } from 'react-router';
import { HamburgerMenu } from './HamburgerMenu.tsx';
import AuthProvider from './AuthProvider.tsx';

export const App = () => {
    return (
        <AuthProvider>
            <RiveAnimation />
            <HamburgerMenu />

            <main>
                <Outlet />
            </main>
        </AuthProvider>
    );
};
