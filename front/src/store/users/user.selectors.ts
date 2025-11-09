import { RootState } from '../store.ts';

export const getUsersState = (state: RootState): RootState['users'] => state.users;
