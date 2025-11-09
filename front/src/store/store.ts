import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from './rootSaga';
import usersReducer from './users/users.reducer.ts';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { TWSClient } from '../componts/SocketProvider.tsx';

export type SagaContext = {
    wsClient: TWSClient | null;
};

export const sagaMiddleware: SagaMiddleware<SagaContext> = createSagaMiddleware({
    context: {
        wsClient: null,
    },
});

const reducer = { users: usersReducer };

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
