import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Interest {
  id: number;
  text: string;
}

interface AuthState {  
  email: string;
  password: string;
}

interface DataState {
  avatar: any;
  fullname: string;
  nickname: string;
  phonenumber: string;
}

interface UserState {
  email: string;
  password: string;
  interests: Interest[];
  avatar: string;
  fullname: string;
  nickname: string;
  phonenumber: string;
}

const initialState: UserState = {   
  email: '',
  password: '',
  interests: [],
  avatar: '',
  fullname: '',
  nickname: '',
  phonenumber: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setEmailAndPasswordUser: (state, action: PayloadAction<AuthState>) => {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    setSkip: (state, action: PayloadAction<boolean>) => {
      state.interests = [];
    },
    addInterest: (state, action: PayloadAction<Interest>) => {
      const interestExists = state.interests.find(interest => interest.id === action.payload.id);
      if (!interestExists) {
        state.interests.push(action.payload);
      } else {
        const index = state.interests.findIndex(interest => interest.id === action.payload.id);
        if (index !== -1) {
          state.interests.splice(index, 1);
        }
      }
    },
    setDataUser: (state, action: PayloadAction<DataState>) => {
      state.avatar = action.payload.avatar;
      state.fullname = action.payload.fullname;
      state.nickname = action.payload.nickname;
      state.phonenumber = action.payload.phonenumber;
    }
  },
});

export const {setEmailAndPasswordUser, setSkip, addInterest, setDataUser } = userSlice.actions;

export default userSlice.reducer;