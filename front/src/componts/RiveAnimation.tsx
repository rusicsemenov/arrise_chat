import { Alignment, Fit, Layout, StateMachineInput, useRive } from '@rive-app/react-canvas';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

/**
 * State in not necessary and useImperativeHandle
 * this is example how to use rive with react
 * from parent component
 */

export const RiveAnimation = forwardRef((_, ref) => {
    const [onOfInput, setOnOfInput] = useState<StateMachineInput | null>(null);
    const [isDark, setIsDark] = useState(
        globalThis.matchMedia('(prefers-color-scheme: dark)').matches,
    );

    const { rive, RiveComponent } = useRive({
        src: '/animations/nature.riv',
        autoplay: true,
        stateMachines: 'Start',
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.TopLeft,
        }),
    });

    useEffect(() => {
        const machines = rive?.stateMachineInputs('Start');
        if (machines) {
            setOnOfInput(machines.find((input) => input.name === 'on/off') || null);
        }

        const media = globalThis.matchMedia('(prefers-color-scheme: dark)');
        const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);
        media.addEventListener('change', listener);

        const html = document.documentElement; // <html>
        const observer = new MutationObserver(() => {
            const theme = html.dataset.theme;
            setIsDark(theme === 'dark');
        });
        observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });

        return () => media.removeEventListener('change', listener);
    }, [rive]);

    const switchTime = (newValue?: boolean) => {
        if (!onOfInput) return;
        onOfInput.value = newValue || !onOfInput.value;
    };

    useEffect(() => {
        switchTime(isDark);
    }, [isDark, onOfInput]);

    useImperativeHandle(ref, () => ({
        switchTime,
    }));

    return <RiveComponent className="rive-animation" />;
});
