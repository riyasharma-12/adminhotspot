import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { aboutService } from "../../services/api";

// About interface
interface About {
  id: number;
  titleOne: string;
  titleTwo: string;
  descriptionOne: string;
  descriptionTwo: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
}

// State type
interface AboutState {
  abouts: About[];
  selectedAbout: About | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AboutState = {
  abouts: [],
  selectedAbout: null,
  loading: false,
  error: null,
};

// ================= Async Thunks =================

// Fetch all about sections
export const fetchAbouts = createAsyncThunk("about/fetchAbouts", async () => {
  const response = await aboutService.getAbout();
  return response.data;
});

// Fetch by ID
export const fetchAboutById = createAsyncThunk(
  "about/fetchAboutById",
  async (id: string) => {
    const response = await aboutService.getAboutById(id);
    return response.data;
  }
);

// Create about
export const createAbout = createAsyncThunk(
  "about/createAbout",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await aboutService.createAbout(formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to create about");
    }
  }
);

// Update about
export const updateAbout = createAsyncThunk(
  "about/updateAbout",
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const response = await aboutService.updateAbout(id, formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to update about");
    }
  }
);

// Delete about
export const deleteAbout = createAsyncThunk(
  "about/deleteAbout",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await aboutService.deleteAbout(id);
      return { id, ...response.data };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || "Failed to delete about");
    }
  }
);

// ================= Slice =================

const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {
    clearSelectedAbout: (state) => {
      state.selectedAbout = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAbouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAbouts.fulfilled, (state, action) => {
        state.loading = false;
        state.abouts = action.payload?.data || [];
      })
      .addCase(fetchAbouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch about records";
      })

      // Fetch by ID
      .addCase(fetchAboutById.fulfilled, (state, action) => {
        state.selectedAbout = action.payload.data;
      })

      // Create
      .addCase(createAbout.fulfilled, (state, action) => {
        state.abouts.push(action.payload.data);
      })
      .addCase(createAbout.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateAbout.fulfilled, (state, action) => {
        const updated = action.payload.data;
        state.abouts = state.abouts.map((item) =>
          item.id === updated.id ? updated : item
        );
        if (state.selectedAbout?.id === updated.id) {
          state.selectedAbout = updated;
        }
      })
      .addCase(updateAbout.rejected, (state, action) => {
        state.error = action.payload as string;
      })

    //   // Delete
      .addCase(deleteAbout.fulfilled, (state, action) => {
        state.abouts = state.abouts.filter(
          (item) => item.id !== Number(action.payload.id)
        );
        if (state.selectedAbout?.id === Number(action.payload.id)) {
          state.selectedAbout = null;
        }
      })
      .addCase(deleteAbout.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedAbout, clearError } = aboutSlice.actions;
export default aboutSlice.reducer;
