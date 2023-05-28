import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
  userId: 2,
  nickname: '',
  email: '',
  accessToken: '',
  refreshToken: '',
  cuss: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.nickname = action.payload.nickname;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },

    setRefreshToken(state, action) {
      state.refreshToken = action.payload.refreshToken;
    },

    increaseCuss(state, action) {
      state.cuss = action.payload.cuss;
    },
  },
  extraReducers: builder => {},
});

export default userSlice;
