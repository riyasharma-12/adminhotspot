import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { blogService } from "../../services/api";

interface BlogState {
  blogs: any[];
  selectedBlog: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: BlogState = {
  blogs: [],
  selectedBlog: null,
  loading: false,
  error: null,
};

// -------------------- THUNKS --------------------



export const fetchBlogs = createAsyncThunk(
  "blog/fetchAll",
  async (params: any, { rejectWithValue }) => {
    try {
      return await blogService.getBlogs(params);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch blogs");
    }
  }
);


export const fetchBlogById = createAsyncThunk(
  "blog/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await blogService.getBlogById(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch blog");
    }
  }
);

export const createBlog = createAsyncThunk(
  "blog/create",
  async (payload: any, { rejectWithValue }) => {
    try {
      return await blogService.createBlog(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to create blog");
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blog/update",
  async ({ id, payload }: { id: string; payload: any }, { rejectWithValue }) => {
    try {
      return await blogService.updateBlog(id, payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to update blog");
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blog/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await blogService.deleteBlog(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to delete blog");
    }
  }
);

// -------------------- SLICE --------------------

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        // state.blogs = action.payload;
         state.blogs = action.payload.blogs;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // FETCH ONE
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.selectedBlog = action.payload;
      })

      // CREATE
.addCase(createBlog.fulfilled, (state, action) => {
  state.blogs.unshift(action.payload.data);
})

// UPDATE
.addCase(updateBlog.fulfilled, (state, action) => {
  const updatedBlog = action.payload.data;

  const index = state.blogs.findIndex(
    (b) => b.id === updatedBlog.id
  );

  if (index !== -1) {
    state.blogs[index] = updatedBlog;
  }

  if (state.selectedBlog?.id === updatedBlog.id) {
    state.selectedBlog = updatedBlog;
  }
})

      // UPDATE
    //   .addCase(updateBlog.fulfilled, (state, action) => {
    //     const index = state.blogs.findIndex(
    //       (b) => b.id === action.payload.id
    //     );
    //     if (index !== -1) state.blogs[index] = action.payload;
    //     if (state.selectedBlog?.id === action.payload.id) {
    //       state.selectedBlog = action.payload;
    //     }
    //   })

    

      // DELETE
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter((b) => b.id !== action.payload);
      });
  },
});

export const { clearSelectedBlog } = blogSlice.actions;
export default blogSlice.reducer;
