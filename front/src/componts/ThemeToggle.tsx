import { ReactElement, useState } from 'react';

export const ThemeToggle = (): ReactElement => {
    const htmlElement = document.documentElement;

    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('theme');
        const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';
        htmlElement.dataset.theme = initialTheme;
        return initialTheme;
    });

    const toggle = (): void => {
        const currentTheme = htmlElement.dataset.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        htmlElement.dataset.theme = newTheme;
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    };

    return (
        <button
            type="button"
            className="theme-toggle"
            onClick={toggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <span className="indicator">
                <span className="dot"></span>
            </span>
            <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>
    );
};
