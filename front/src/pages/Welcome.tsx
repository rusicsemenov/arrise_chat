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
        // Handle form submission logic here

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const name = formData.get('name');
        const password = formData.get('password');

        const validName = sanitizedName(name);
        const validPassword = sanitizedPassword(password);

        if (validName) {
            setError((prev) => ({ ...prev, name: '' }));
        } else {
            setError((prev) => ({ ...prev, name: 'Name is required' }));
        }

        if (validPassword) {
            setError((prev) => ({ ...prev, password: '' }));
        } else {
            setError((prev) => ({ ...prev, password: 'Password is required' }));
        }

        if (validName && validPassword) {
            console.log('Password:', password);
            console.log('Name:', name);

            wsClient?.send('MESSAGE', { type: 'LOGIN', name: validName, password: validPassword });
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

// A simple name validation function (at least 3 characters)

function sanitizedName(name: unknown): string | null {
    if (name && typeof name === 'string' && name.trim() !== '' && name.trim().length >= 3) {
        return name.trim();
    }

    return null;
}

// A simple password validation function (at least 6 characters)
// we can use regex for a more complex validation if needed

function sanitizedPassword(password: unknown): string | null {
    if (
        password &&
        typeof password === 'string' &&
        password.trim() !== '' &&
        password.trim().length >= 6
    ) {
        return password.trim();
    }

    return null;
}
