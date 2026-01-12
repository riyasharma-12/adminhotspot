// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { productService } from "../../services/api";

// interface Product {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   image?: string;
//   subCategoryId: string;
// }

// interface ProductState {
//   products: Product[];
//   loading: boolean;
// }

// const initialState: ProductState = {
//   products: [],
//   loading: false,
// };

// export const fetchProducts = createAsyncThunk(
//   "product/fetchProducts",
//   async (params?: any) => {
//     return await productService.getProducts(params);
//   }
// );

// export const createProduct = createAsyncThunk(
//   "product/createProduct",
//   async (payload: FormData) => {
//     return await productService.createProduct(payload);
//   }
// );

// export const updateProduct = createAsyncThunk(
//   "product/updateProduct",
//   async ({ id, data }: { id: string; data: FormData }) => {
//     return await productService.updateProduct(id, data);
//   }
// );

// export const deleteProduct = createAsyncThunk(
//   "product/deleteProduct",
//   async (id: string) => {
//     await productService.deleteProduct(id);
//     return id;
//   }
// );

// const productSlice = createSlice({
//   name: "product",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProducts.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.products = action.payload.data;
//       })
//       .addCase(createProduct.fulfilled, (state, action) => {
//         state.products.push(action.payload.data);
//       })
//       .addCase(updateProduct.fulfilled, (state, action) => {
//         const index = state.products.findIndex(
//           (p) => p.id === action.payload.data.id
//         );
//         if (index !== -1) state.products[index] = action.payload.data;
//       })
//       .addCase(deleteProduct.fulfilled, (state, action) => {
//         state.products = state.products.filter(
//           (p) => p.id !== action.payload
//         );
//       });
//   },
// });

// export default productSlice.reducer;
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
  total: number;
  loading: boolean;
}

const initialState: ProductState = {
  products: [],
  total: 0,
  loading: false,
};

//  Fetch products with pagination params
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params?: { page?: number; limit?: number }) => {
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
      // FETCH
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data; // products array
        state.total = action.payload.total;   // total count
      })

      // CREATE
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload.data);
        state.total += 1;
      })

      // UPDATE
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.id === action.payload.data.id
        );
        if (index !== -1) {
          state.products[index] = action.payload.data;
        }
      })

      // DELETE
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p.id !== action.payload
        );
        state.total -= 1;
      });
  },
});

export default productSlice.reducer;
