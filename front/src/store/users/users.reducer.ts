import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '../../../../types';

type Status = 'idle' | 'loading' | 'succeeded' | 'error';

type UserState = {
    users: User[] | null;
    currentUser: User | null;
    status: Status;
    loading: boolean;
};

const initialState: UserState = {
    users: [],
    currentUser: null,
    status: 'idle',
    loading: false,
};

export const getUsers = createAsyncThunk('users/getUsers', async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return await response.json();
});

const usersReducer = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers(state, action) {
            state.users = action.payload;
        },
        setCurrentUser(state, action) {
            state.currentUser = action.payload;
        },
        setStatus(state, action) {
            state.status = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.status = 'error';
                console.error('Error fetching users:', action.error.message);
            });
    },
});

export const { setUsers, setCurrentUser, setStatus } = usersReducer.actions;

export default usersReducer.reducer;
