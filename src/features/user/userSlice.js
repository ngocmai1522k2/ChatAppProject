import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        initialState,
    },
    reducers: {
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        setUserAvatar: (state, action) => {
            state.currentUser.avatar = action.payload;
        }
    },
});

export const { setCurrentUser, setUserAvatar } = userSlice.actions;

export default userSlice.reducer;