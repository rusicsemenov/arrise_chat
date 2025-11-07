import { RiveAnimation } from './RiveAnimation.tsx';
import { useRef } from 'react';
import { Outlet } from 'react-router';
import { HamburgerMenu } from './HamburgerMenu.tsx';
import AuthProvider from './AuthProvider.tsx';

export const App = () => {
    const riveRef = useRef<{ switchTime: () => void }>(null);

    const toggle = () => {
        riveRef.current?.switchTime();
    };

    return (
        <AuthProvider>
            <RiveAnimation ref={riveRef} />
            <HamburgerMenu />

            <main>
                <Outlet />
            </main>
        </AuthProvider>
    );
};
