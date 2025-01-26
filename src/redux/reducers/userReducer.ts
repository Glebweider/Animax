import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInterest {
  id: number;
  text: string;
}

interface IAnime {
  animeId: string;
  poster: {
    originalUrl: string;
  };
  score: number;
  rating: string;
}

interface IPremium {
  premium: boolean;
  duration: number;
}

interface IUserState {
  uuid: string;
  email: string;
  interests: IInterest[];
  premium: {
    premium: boolean;
    duration: number;
  },
  profile: {
    avatar: string;
    fullname: string;
    nickname: string;    
  };
  preferences: {
    phonenumber: string;
  };
  animelist: IAnime[];
}

const initialState: IUserState = {
  uuid: '',
  email: '',
  interests: [],
  premium: {
    premium: false,
    duration: 0
  },
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
    setUser: (state, action: PayloadAction<IUserState>) => {
      state.uuid = action.payload.uuid;
      state.email = action.payload.email;
      state.interests = action.payload.interests;
      state.premium = action.payload.premium;
      state.profile = action.payload.profile;
      state.preferences = action.payload.preferences;
      state.animelist = action.payload.animelist;
    },
    removeAnime: (state, action: PayloadAction<string>) => {
      state.animelist = state.animelist.filter(anime => anime.animeId !== action.payload);
    },
    addAnime: (state, action: PayloadAction<IAnime>) => {
      state.animelist.push(action.payload);
    },
    setPremium: (state, action: PayloadAction<IPremium>) => {
      state.premium.premium = action.payload.premium;
      state.premium.duration = action.payload.duration;
    }
  },
});

export const { setUser, removeAnime, addAnime, setPremium } = userSlice.actions;

export default userSlice.reducer;