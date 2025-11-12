import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import pageReducer from './slices/pageSlice';
import queryReducer from './slices/querySlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import blogReducer from './slices/blogSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    pages: pageReducer,
    queries: queryReducer,
    products: productReducer,
    categories: categoryReducer,
    blogs: blogReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;