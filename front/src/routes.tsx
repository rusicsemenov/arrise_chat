import { createBrowserRouter } from 'react-router';
import { App } from './components/App.tsx';
import { lazy } from 'react';

const NotFound = lazy(() => import('./pages/NotFound.tsx'));
const Users = lazy(() => import('./pages/Users.tsx'));
const Rooms = lazy(() => import('./pages/Rooms.tsx'));
const Room = lazy(() => import('./pages/Room.tsx'));
const Welcome = lazy(() => import('./pages/Welcome.tsx'));

export const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
        children: [
            {
                index: true,
                Component: Welcome,
            },
            {
                path: '/users',
                Component: Users,
            },
            {
                path: '/rooms',
                Component: Rooms,
            },
            {
                path: '/room/:id',
                Component: Room,
            },
            {
                path: '*',
                Component: NotFound,
            },
        ],
    },
]);
