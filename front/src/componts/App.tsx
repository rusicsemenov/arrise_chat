import { RiveAnimation } from './RiveAnimation.tsx';
import { useRef } from 'react';

export const App = () => {
    const riveRef = useRef<{ switchTime: () => void }>(null);

    const toggle = () => {
        riveRef.current?.switchTime();
    };

    return (
        <div>
            <RiveAnimation ref={riveRef} />
            <main></main>
        </div>
    );
};
