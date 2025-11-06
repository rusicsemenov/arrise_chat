import { createRoot } from 'react-dom/client';
import './styles/main.scss';
import { App } from './componts/App.tsx';
import { SocketProvider } from './componts/SocketProvider.tsx';

const appDiv = document.getElementById('app');

if (!appDiv) {
    throw new Error('Root element not found');
}

const root = createRoot(appDiv);
root.render(
    <SocketProvider>
        <App />
    </SocketProvider>,
);
