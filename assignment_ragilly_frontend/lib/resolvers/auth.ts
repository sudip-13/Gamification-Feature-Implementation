import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthTokenState {
    token: string | null;
    email: string | null;
    userName: string | null;
    userId: string | null;
}

const initialState: AuthTokenState = {
    token: null,
    email: null,
    userName: null,
    userId: null
};

const authTokenSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
        },
        clearToken(state) {
            state.token = null;
        },
        setEmail(state, action: PayloadAction<string>) {
            state.email = action.payload;
        },
        setUserName(state, action: PayloadAction<string>) {
            state.userName = action.payload;
        },
        setUserId(state, action: PayloadAction<string>) {
            state.userId = action.payload;
        }
    },
});

// Export the actions
export const { setToken, clearToken,setEmail,setUserName,setUserId } = authTokenSlice.actions;

// Export the reducer
export default authTokenSlice.reducer;