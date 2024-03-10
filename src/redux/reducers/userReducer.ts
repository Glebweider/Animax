import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Interest {
  id: number;
  text: string;
}

interface Anime {
  animeId: string;
  poster: {
    originalUrl: string;
  };
  score: number;
  rating: string;
}

interface UserState {
  uuid: string;
  email: string;
  password: string;
  interests: Interest[];
  profile: {
    avatar: string;
    fullname: string;
    nickname: string;    
  };
  preferences: {
    phonenumber: string;
  };
  animelist: Anime[]
}

const initialState: UserState = {
  uuid: '',
  email: '',
  password: '',
  interests: [],
  profile: {
    avatar: '',
    fullname: '',
    nickname: '',  
  },
  preferences: {
    phonenumber: '',
  },
  animelist: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.uuid = action.payload.uuid;
      state.password = action.payload.password;
      state.email = action.payload.email;
      state.interests = action.payload.interests;
      state.profile = action.payload.profile;
      state.preferences = action.payload.preferences;
      state.animelist = action.payload.animelist;
    },
  },
});

export const {setUser} = userSlice.actions;

export default userSlice.reducer;