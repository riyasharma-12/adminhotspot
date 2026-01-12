import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { blogContentService, BlogContent } from "../../services/api";

interface BlogContentState {
  contents: BlogContent[];
  loading: boolean;
  error: string | null;
}

const initialState: BlogContentState = {
  contents: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchContentsByBlogId = createAsyncThunk(
  "blogContent/fetchByBlogId",
  async (blogId: string, { rejectWithValue }) => {
    try {
      const data = await blogContentService.getContentsByBlogId(blogId);
      return data.data as BlogContent[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createContent = createAsyncThunk(
  "blogContent/create",
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const data = await blogContentService.createContent(payload);
      return data.data as BlogContent;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Thunks
export const fetchAllContents = createAsyncThunk(
  "blogContent/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await blogContentService.getAllContents();
      return data.data as BlogContent[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const updateContent = createAsyncThunk(
  "blogContent/update",
  async ({ id, payload }: { id: string; payload: FormData }, { rejectWithValue }) => {
    try {
      const data = await blogContentService.updateContent(id, payload);
      return data.data as BlogContent;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const deleteContent = createAsyncThunk(
  "blogContent/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await blogContentService.deleteContent(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Slice
const blogContentSlice = createSlice({
  name: "blogContent",
  initialState,
  reducers: {
    resetBlogContent: (state) => {
      state.contents = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchContentsByBlogId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentsByBlogId.fulfilled, (state, action: PayloadAction<BlogContent[]>) => {
        state.loading = false;
        state.contents = action.payload;
      })
      .addCase(fetchContentsByBlogId.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllContents.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAllContents.fulfilled, (state, action: PayloadAction<BlogContent[]>) => {
      state.loading = false;
      state.contents = action.payload;
    })
    .addCase(fetchAllContents.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    })
      // CREATE
      .addCase(createContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContent.fulfilled, (state, action: PayloadAction<BlogContent>) => {
        state.loading = false;
        state.contents.push(action.payload);
      })
      .addCase(createContent.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // UPDATE
      .addCase(updateContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContent.fulfilled, (state, action: PayloadAction<BlogContent>) => {
        state.loading = false;
        const index = state.contents.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.contents[index] = action.payload;
      })
      .addCase(updateContent.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // DELETE
      .addCase(deleteContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContent.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.contents = state.contents.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteContent.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetBlogContent } = blogContentSlice.actions;

export default blogContentSlice.reducer;
