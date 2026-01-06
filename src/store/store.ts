import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import categoryReducer from "./slices/categorySlice";
import subCategoryReducer from "./slices/subCategorySlice";
import productReducer from "./slices/productSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    categories:categoryReducer,
    subCategories: subCategoryReducer,
    products:productReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;