import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { benefitService } from "../../services/api";

interface BenefitItem {
  id?: number;
  title: string;
  description: string;
}

interface Benefit {
  id: number;
  heading: string;
  description: string;
  items: BenefitItem[];
}

interface BenefitState {
  benefits: Benefit[];
  selectedBenefit: Benefit | null;
  loading: boolean;
  error: string | null;
}

const initialState: BenefitState = {
  benefits: [],
  selectedBenefit: null,
  loading: false,
  error: null,
};

// ===== Async Thunks =====
export const fetchBenefits = createAsyncThunk("benefits/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await benefitService.getBenefits();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch benefits");
  }
});

export const createBenefit = createAsyncThunk(
  "benefits/create",
  async (data: { heading: string; description: string; items: BenefitItem[] }, { rejectWithValue }) => {
    try {
      const response = await benefitService.createBenefit(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create benefit");
    }
  }
);

export const updateBenefit = createAsyncThunk(
  "benefits/update",
  async (
    { id, data }: { id: number; data: { heading: string; description: string; items: BenefitItem[] } },
    { rejectWithValue }
  ) => {
    try {
      const response = await benefitService.updateBenefit(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update benefit");
    }
  }
);

export const deleteBenefit = createAsyncThunk("benefits/delete", async (id: number, { rejectWithValue }) => {
  try {
    const response = await benefitService.deleteBenefit(id);
    return id; // return id for removing from state
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete benefit");
  }
});

// ===== Slice =====
const benefitSlice = createSlice({
  name: "benefits",
  initialState,
  reducers: {
    clearSelectedBenefit: (state) => {
      state.selectedBenefit = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBenefits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBenefits.fulfilled, (state, action) => {
        state.loading = false;
        state.benefits = action.payload;
      })
      .addCase(fetchBenefits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createBenefit.fulfilled, (state, action) => {
        state.benefits.push(action.payload);
      })
      .addCase(createBenefit.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateBenefit.fulfilled, (state, action) => {
        const updated = action.payload;
        state.benefits = state.benefits.map((b) => (b.id === updated.id ? updated : b));
      })
      .addCase(updateBenefit.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteBenefit.fulfilled, (state, action) => {
        state.benefits = state.benefits.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBenefit.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedBenefit } = benefitSlice.actions;
export default benefitSlice.reducer;
