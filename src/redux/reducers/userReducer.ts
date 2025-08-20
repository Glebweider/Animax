import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInterest {
  id: number;
  text: string;
}

interface IUserPremium {
  premium: boolean;
  duration: number;
}

export interface IUserAnimeStats {
  counterWatchedAnime: number;
  timeSpentWatchingAnime: number;
  achievementsCountWatchedAnime: number;
}

export interface IUserNotificationSettings {
  newEpisodes: boolean;
  newReleases: boolean;
  generalNotification: boolean;
  appUpdates: boolean;
  subscription: boolean;
}

interface IUserState {
  uuid: string;
  email: string;
  interests: IInterest[];
  description: string;
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
  animelist: string[];
  animestats: IUserAnimeStats;
  notificationSettings: IUserNotificationSettings;
}

const initialState: IUserState = {
  uuid: '',
  email: '',
  interests: [],
  description: '',
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
  animelist: [],
  animestats: {
    counterWatchedAnime: 0,
    timeSpentWatchingAnime: 0,
    achievementsCountWatchedAnime: 0,
  },
  notificationSettings: {
    newEpisodes: false,
    newReleases: false,
    generalNotification: false,
    appUpdates: false,
    subscription: false,
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUserState>) => {
      state.uuid = action.payload.uuid;
      state.email = action.payload.email;
      state.description = action.payload.description;
      state.interests = action.payload.interests;
      state.premium = action.payload.premium;
      state.profile = action.payload.profile;
      state.preferences = action.payload.preferences;
      state.animelist = action.payload.animelist;
      state.animestats = action.payload.animestats;
      state.notificationSettings = action.payload.notificationSettings
    },
    removeAnime: (state, action: PayloadAction<string>) => {
      state.animelist = state.animelist.filter(animeId => animeId !== action.payload);
    },
    addAnime: (state, action: PayloadAction<string>) => {
      state.animelist.push(action.payload);
    },
    setPremium: (state, action: PayloadAction<IUserPremium>) => {
      state.premium.premium = action.payload.premium;
      state.premium.duration = action.payload.duration;
    },
    setAlertSettings: (state, action: PayloadAction<IUserNotificationSettings>) => {
      state.notificationSettings.newEpisodes = action.payload.newEpisodes;
      state.notificationSettings.newReleases = action.payload.newReleases;
      state.notificationSettings.generalNotification = action.payload.generalNotification;
      state.notificationSettings.appUpdates = action.payload.appUpdates;
      state.notificationSettings.subscription = action.payload.subscription;
    },
  },
});

export const { setUser, removeAnime, addAnime, setPremium, setAlertSettings } = userSlice.actions;

export default userSlice.reducer;