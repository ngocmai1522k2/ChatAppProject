import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApiMessageNoneToken, getApiapiConversation } from '../../api/CallApi';
import { postApiMessageNoneToken } from '../../api/CallApi';

// Fetch individual messages from API
const fetchMessagesFromApi = async (senderId, receiverId) => {
  const response = await getApiMessageNoneToken(
    '/getMessages/' + receiverId + '?senderId=' + senderId,
  );
  console.log('response', response.data);
  return response.data;
};

// Async thunk to fetch individual messages
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async ({ senderId, receiverId }) => {
    return fetchMessagesFromApi(senderId, receiverId);
  },
);

// Fetch group messages from API
const fetchGroupMessagesFromApi = async (conversationId) => {
  const response = await getApiapiConversation(
    '/getGroupMessages/' + conversationId,
  );
  console.log('response Group messages: ', response.data.messages);
  return response.data.messages;
};

// Async thunk to fetch group messages
export const fetchGroupMessages = createAsyncThunk(
  'messages/fetchGroupMessages',
  async ({ conversationId }) => {
    return fetchGroupMessagesFromApi(conversationId);
  },
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [], // State for individual messages
    groupMessages: [], // State for group messages
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
    addGroupMessage: (state, action) => {
      state.groupMessages.push(action.payload);
    },
    getGroupMessages: (state, action) => {
      state.groupMessages = action.payload;
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
        state.groupMessages = action.payload;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchGroupMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGroupMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export actions
export const { addMessage, getMessages, addGroupMessage, getGroupMessages } = messagesSlice.actions;

// Export reducer
export default messagesSlice.reducer;
