import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../services/api";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  subCategoryId: string;
}

interface ProductState {
  products: Product[];
  loading: boolean;
}

const initialState: ProductState = {
  products: [],
  loading: false,
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params?: any) => {
    return await productService.getProducts(params);
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (payload: FormData) => {
    return await productService.createProduct(payload);
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, data }: { id: string; data: FormData }) => {
    return await productService.updateProduct(id, data);
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id: string) => {
    await productService.deleteProduct(id);
    return id;
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload.data);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.id === action.payload.data.id
        );
        if (index !== -1) state.products[index] = action.payload.data;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p.id !== action.payload
        );
      });
  },
});

export default productSlice.reducer;
