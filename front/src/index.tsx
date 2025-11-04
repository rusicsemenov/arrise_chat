import { createRoot } from 'react-dom/client';
import './styles/main.scss';

const appDiv = document.getElementById('app');

if (!appDiv) {
    throw new Error('Root element not found');
}

const root = createRoot(appDiv);
root.render(<h1>Hello, world</h1>);
