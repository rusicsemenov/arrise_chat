import { createRoot } from 'react-dom/client';
import './styles/main.scss';
import { SocketProvider } from './componts/SocketProvider.tsx';
import { router } from './routes.tsx';
import { RouterProvider } from 'react-router';

const appDiv = document.getElementById('app');

if (!appDiv) {
    throw new Error('Root element not found');
}

const root = createRoot(appDiv);

root.render(
    <SocketProvider>
        <RouterProvider router={router} />
    </SocketProvider>,
);
