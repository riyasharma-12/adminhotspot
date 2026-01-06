import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { subCategoryService } from "../../services/api";

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
}

interface SubCategoryState {
  subCategories: SubCategory[];
  loading: boolean;
  error: string | null;
}

const initialState: SubCategoryState = {
  subCategories: [],
  loading: false,
  error: null,
};

/* ===================== THUNKS ===================== */

// FETCH
export const fetchSubCategories = createAsyncThunk(
  "subcategory/fetchSubCategories",
  async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
  }) => {
    return await subCategoryService.getSubCategories(params);
  }
);

// CREATE
export const createSubCategory = createAsyncThunk(
  "subcategory/createSubCategory",
  async (payload: { name: string; categoryId: string }) => {
    return await subCategoryService.createSubCategory(payload);
  }
);

// UPDATE
export const updateSubCategory = createAsyncThunk(
  "subcategory/updateSubCategory",
  async ({
    id,
    data,
  }: {
    id: string;
    data: { name: string; categoryId: string };
  }) => {
    return await subCategoryService.updateSubCategory(id, data);
  }
);

// DELETE
export const deleteSubCategory = createAsyncThunk(
  "subcategory/deleteSubCategory",
  async (id: string) => {
    await subCategoryService.deleteSubCategory(id);
    return id;
  }
);

/* ===================== SLICE ===================== */

const subCategorySlice = createSlice({
  name: "subcategory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = action.payload.data;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch subcategories";
      })

      // CREATE
      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.subCategories.push(action.payload.data);
      })

      // UPDATE
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        const index = state.subCategories.findIndex(
          (sc) => sc.id === action.payload.data.id
        );
        if (index !== -1) {
          state.subCategories[index] = action.payload.data;
        }
      })

      // DELETE
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.subCategories = state.subCategories.filter(
          (sc) => sc.id !== action.payload
        );
      });
  },
});

export default subCategorySlice.reducer;
