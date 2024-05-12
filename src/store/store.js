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
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
    });

export default store;