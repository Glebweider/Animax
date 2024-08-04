import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import userReducer from './reducers/userReducer';
import sortReducer from './reducers/sortReducer';
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";

const store = configureStore({
  reducer: {
    authReducer,
    userReducer,
    sortReducer,
  },
  devTools: false,
  enhancers: (defaultEnhancers) => [
    ...defaultEnhancers,
    devToolsEnhancer(),
  ],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
