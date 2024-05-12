import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApiMessageNoneToken } from '../../api/CallApi';
import { postApiMessageNoneToken } from '../../api/CallApi';
import { setCurrentUser } from '../user/userSlice';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


const fetchMessagesFromApi = async (senderId, receiverId) => {
  const response = await getApiMessageNoneToken(
    '/getMessages/' + receiverId + '?senderId=' + senderId,
  );
  return response.data;
};

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async ({ senderId, receiverId }) => {
    return fetchMessagesFromApi(senderId, receiverId);
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
      .addCase(fetchMessages.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addMessage, getMessages} = messagesSlice.actions;

export default messagesSlice.reducer;