import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoryService } from "../../services/api";

interface Category {
  id: string;
  name: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (params?: any) => {
    return await categoryService.getCategories(params);
  }
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (payload: { name: string }) => {
    return await categoryService.createCategory(payload);
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, data }: { id: string; data: { name: string } }) => {
    return await categoryService.updateCategory(id, data);
  }
);

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id: string) => {
    await categoryService.deleteCategory(id);
    return id;
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })

      // CREATE
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload.data);
      })

      // UPDATE
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (c) => c.id === action.payload.data.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload.data;
        }
      })

      // DELETE
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload
        );
      });
  },
});

export default categorySlice.reducer;
