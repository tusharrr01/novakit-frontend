import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import settingReducer from './reducers/settingSlice';
import layoutReducer from './reducers/layoutSlice';
import { baseApi } from './api/baseApi';

const appReducer = combineReducers({
  auth: authReducer,
  setting: settingReducer,
  layout: layoutReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'auth/setLogout') {
    // Clear redux state fully on sign-out
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Turn off serializability checks for custom mapping/ref setups
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
