import { createRoot } from 'react-dom/client';
import './styles/main.scss';
import { SocketProvider } from './components/SocketProvider.tsx';
import { router } from './routes.tsx';
import { RouterProvider } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';

const appDiv = document.getElementById('app');

if (!appDiv) {
    throw new Error('Root element not found');
}

const root = createRoot(appDiv);

root.render(
    <SocketProvider>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </SocketProvider>,
);
