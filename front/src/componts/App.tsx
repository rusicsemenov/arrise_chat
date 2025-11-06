import { RiveAnimation } from './RiveAnimation.tsx';
import { useRef } from 'react';
import { Outlet } from 'react-router';
import { HamburgerMenu } from './HamburgerMenu.tsx';

export const App = () => {
    const riveRef = useRef<{ switchTime: () => void }>(null);

    const toggle = () => {
        riveRef.current?.switchTime();
    };

    return (
        <>
            <RiveAnimation ref={riveRef} />
            <HamburgerMenu />

            <main>
                <Outlet />
            </main>
        </>
    );
};
