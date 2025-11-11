import { FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSocketContext } from '../componts/SocketProvider.tsx';
import { useAuthContext } from '../componts/AuthProvider.tsx';

// Will be better to use react-hook-form, but will do it without it for simplicity

const Welcome = () => {
    const nameRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState({ name: '', password: '' });

    const navigate = useNavigate();
    const { wsClient } = useSocketContext();
    const { isAuth } = useAuthContext();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const formData = new FormData(e.target as HTMLFormElement);
        const name = sanitizedName(formData.get('name'));
        const password = sanitizedPassword(formData.get('password'));

        let nameError = '';
        if (!name) {
            nameError = 'Name is required';
        } else if (name.length > 20) {
            nameError = 'Name must be less than 20 characters';
        }

        setError({
            name: nameError,
            password: password ? '' : 'Password is required',
        });

        if (name && password && name.length <= 20) {
            wsClient?.send('MESSAGE', { type: 'LOGIN', name, password });
        }
    };

    useEffect(() => {
        if (isAuth) {
            navigate('/rooms');
        }
    }, [isAuth]);

    useEffect(() => {
        nameRef.current?.focus();
    }, []);

    return (
        <div className="welcome">
            <div className="card content">
                <h1>Welcome to the Chat Application!</h1>
                <p>Use existing account or create a new one by entering your name and password</p>

                <form onSubmit={handleSubmit} autoComplete="off">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" autoComplete="off" ref={nameRef} />
                    {error.name && <span className="error">⚠️ {error.name}</span>}

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        autoComplete="new-password"
                    />
                    {error.password && <span className="error">⚠️ {error.password}</span>}

                    <button type="submit" className="btn">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Welcome;

function sanitizedName(name: unknown): string | null {
    return typeof name === 'string' && name.trim().length >= 3 ? name.trim() : null;
}

function sanitizedPassword(password: unknown): string | null {
    return typeof password === 'string' && password.trim().length >= 6 ? password.trim() : null;
}
