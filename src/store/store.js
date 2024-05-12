import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../features/user/userSlice";
import conversationReducer from "../features/conversation/conversationSlice";
import messagesReducer from "../features/messages/messagesSlice";

const store =  configureStore({
    reducer: {
        user: userReducer,
        conversation: conversationReducer,
        messages: messagesReducer,
    },
    });

export default store;