import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import userReducer from './reducers/userReducer';
import sortReducer from './reducers/sortReducer';

const store = configureStore({
  reducer: {
    authReducer,
    userReducer,
    sortReducer,
  } 
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
