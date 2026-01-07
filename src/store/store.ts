import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import categoryReducer from "./slices/categorySlice";
import subCategoryReducer from "./slices/subCategorySlice";
import productReducer from "./slices/productSlice"
import blogReducer from "./slices/blogSlice"
import blogContentReducer from "./slices/blogContentSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    categories:categoryReducer,
    subCategories: subCategoryReducer,
    products:productReducer,
    blog:blogReducer,
    blogContent:blogContentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;