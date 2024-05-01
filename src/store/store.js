import { configureStore } from "@reduxjs/toolkit";

import userReducer from "../features/user/userSlice";
import conversationReducer from "../features/conversation/conversationSlice";

const store =  configureStore({
    reducer: {
        user: userReducer,
        conversation: conversationReducer,
    },
    });

export default store;