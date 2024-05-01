import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    conversations: null,
    currentConversation: null,
    };

const conversationSlice = createSlice({
    name: 'conversation',
    initialState: {
        initialState,
    },
    reducers: {
        setConversations: (state, action) => {
            state.conversations = action.payload;
            state.currentConversation = action.payload[0];
        },
        addMessage: (state, action) => {
            if (!state.currentConversation) {
                state.currentConversation = {};
            }
            if (!state.currentConversation.messages) {
                state.currentConversation.messages = [];
            }
            state.currentConversation.messages.push(action.payload);
        },
    },
});

export const { setConversations, addMessage } = conversationSlice.actions;

export default conversationSlice.reducer;