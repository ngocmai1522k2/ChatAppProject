import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApiMessageNoneToken, getApiapiConversation } from '../../api/CallApi';
import { postApiMessageNoneToken } from '../../api/CallApi';
import { setCurrentUser } from '../user/userSlice';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


const fetchMessagesFromApi = async (senderId, receiverId) => {
  const response = await getApiMessageNoneToken(
    '/getMessages/' + receiverId + '?senderId=' + senderId,
  );
  console.log('response', response.data);
  return response.data;
};

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async ({ senderId, receiverId }) => {
    return fetchMessagesFromApi(senderId, receiverId);
  },
);

const fetchGroupMessagesFromApi = async (conversationId) => {
  const response = await getApiapiConversation(
    '/getGroupMessages/' + conversationId,
  );
  console.log('response Group messages: ', response.data.messages);
  return response.data.messages;
};

export const fetchGroupMessages = createAsyncThunk(
  'messages/fetchGroupMessages',
  async ({ conversationId }) => {
    return fetchGroupMessagesFromApi(conversationId);
  },
);

// export const addMessage = createAsyncThunk(
//   'messages/addMessage',
//   async ({ senderId, receiverId, message }) => {
//     const response = await postApiMessageNoneToken(
//       '/sendMessage/' + receiverId,
//       { message: message,
//         userId: senderId}
//     );
//     return response.data;
//   },
// );

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    getMessages: (state, action) => {
      state.messages = action.payload;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchGroupMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      });
  },
});

export const { addMessage, getMessages} = messagesSlice.actions;

export default messagesSlice.reducer;