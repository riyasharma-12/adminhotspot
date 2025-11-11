import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import pageReducer from './slices/pageSlice';
import queryReducer from './slices/querySlice';
import productReducer from './slices/productSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    pages: pageReducer,
    queries: queryReducer,
    products: productReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;