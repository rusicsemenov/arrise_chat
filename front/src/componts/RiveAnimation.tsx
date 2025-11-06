import { Alignment, Fit, Layout, StateMachineInput, useRive } from '@rive-app/react-canvas';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

/**
 * State in not necessary and useImperativeHandle
 * this is example how to use rive with react
 * from parent component
 */

export const RiveAnimation = forwardRef((_, ref) => {
    const [onOfInput, setOnOfInput] = useState<StateMachineInput | null>(null);

    const { rive, RiveComponent } = useRive({
        src: './animations/nature.riv',
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
    }, [rive]);

    const switchTime = () => {
        if (!onOfInput) return;
        onOfInput.value = !onOfInput.value;
    };

    useImperativeHandle(ref, () => ({
        switchTime,
    }));

    return <RiveComponent className="rive-animation" />;
});
