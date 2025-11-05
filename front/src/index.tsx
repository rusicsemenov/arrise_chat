import { createRoot } from 'react-dom/client';
import './styles/main.scss';
import { SocketProvider } from './componts/SocketProvider.tsx';
import { TestComponentProps } from './componts/TestComponent.tsx';

const appDiv = document.getElementById('app');

if (!appDiv) {
    throw new Error('Root element not found');
}

const root = createRoot(appDiv);
root.render(
    <SocketProvider>
        <h1>Hello, world</h1>
        <hr />
        <TestComponentProps />
    </SocketProvider>,
);
