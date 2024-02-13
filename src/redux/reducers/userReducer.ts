import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Interest {
  id: number;
  emoji: string;
  emojiText: string;
}

interface UserState {
  uuid: string;
  username: string;
  password: string;
  email: string;
  interest: boolean; 
  interests: Interest[];
  profile: {
    avatar: string;
    bio: string;
    nickname: string;    
  };
  preferences: {
    lang: string;
    country: string;
    ip: string
  };
  statistics: {
    reviews: number;
    followers: number;
    likes: number;
  }
}

const initialState: UserState = {
  uuid: '',
  username: '',
  password: '',
  email: 'string',
  interest: false, 
  interests: [],
  profile: {
    avatar: '',
    bio: '',
    nickname: '',  
  },
  preferences: {
    lang: '',
    country: '',
    ip: '',
  },
  statistics: {
    reviews: 0,
    followers: 0,
    likes: 0,
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.uuid = action.payload.uuid;
      state.username = action.payload.username;
      state.password = action.payload.password;
      state.email = action.payload.email;
      state.interest = action.payload.interest;
      state.interests = action.payload.interests;
      state.profile = action.payload.profile;
      state.preferences = action.payload.preferences;
      state.statistics = action.payload.statistics;
    },
  },
});

export const {setUser} = userSlice.actions;

export default userSlice.reducer;