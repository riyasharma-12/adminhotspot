import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { homeService } from "../../services/api";

export const fetchHomes = createAsyncThunk("home/fetch", async () => {
  const res = await homeService.getHomes();
  return res.data.data;
});

export const createHome = createAsyncThunk("home/create", async (data: FormData) => {
  const res = await homeService.createHome(data);
  return res.data.data;
});

export const updateHome = createAsyncThunk(
  "home/update",
  async ({ id, formData }: { id: number; formData: FormData }) => {
    const res = await homeService.updateHome(id, formData);
    return res.data.data;
  }
);

export const deleteHome = createAsyncThunk("home/delete", async (id: number) => {
  await homeService.deleteHome(id);
  return id;
});

const homeSlice = createSlice({
  name: "homes",
  initialState: { homes: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHomes.fulfilled, (state, action) => {
        state.loading = false;
        state.homes = action.payload;
      })
      .addCase(deleteHome.fulfilled, (state, action) => {
        state.homes = state.homes.filter((h: any) => h.id !== action.payload);
      });
  },
});

export default homeSlice.reducer;
