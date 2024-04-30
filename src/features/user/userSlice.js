import {createSlice} from '@reduxjs/toolkit';

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
    },
    setFriends: (state, action) => {
      state.currentUser.friends = action.payload;
    },
    addFriend: (state, action) => {
      // Kiểm tra xem currentUser có tồn tại không và có thuộc tính friends không
      if (!state.currentUser) {
        state.currentUser = {};
      }
      if (!state.currentUser.friends) {
        state.currentUser.friends = [];
      }
      // Thêm bạn bè vào danh sách
      state.currentUser.friends.push(action.payload);
    },
  },
});

export const {setCurrentUser, setUserAvatar, setFriends, addFriend} =
  userSlice.actions;

export default userSlice.reducer;
