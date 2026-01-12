
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
//   total: number;
//   loading: boolean;
// }

// const initialState: ProductState = {
//   products: [],
//   total: 0,
//   loading: false,
// };

// //  Fetch products with pagination params
// export const fetchProducts = createAsyncThunk(
//   "product/fetchProducts",
//   async (params?: { page?: number; limit?: number }) => {
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

// export const toggleProductStatus = createAsyncThunk(
//   "product/toggleStatus",
//   async (id: string) => {
//     return await productService.toggleProductStatus(id);
//   }
// );

// const productSlice = createSlice({
//   name: "product",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // FETCH
//       .addCase(fetchProducts.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.products = action.payload.data; // products array
//         state.total = action.payload.total;   // total count
//       })

//       // CREATE
//       .addCase(createProduct.fulfilled, (state, action) => {
//         state.products.unshift(action.payload.data);
//         state.total += 1;
//       })

//       // UPDATE
//       .addCase(updateProduct.fulfilled, (state, action) => {
//         const index = state.products.findIndex(
//           (p) => p.id === action.payload.data.id
//         );
//         if (index !== -1) {
//           state.products[index] = action.payload.data;
//         }
//       })

//       // DELETE
//       .addCase(deleteProduct.fulfilled, (state, action) => {
//         state.products = state.products.filter(
//           (p) => p.id !== action.payload
//         );
//         state.total -= 1;
//       })

//       .addCase(toggleProductStatus.fulfilled, (state, action) => {
//         const index = state.products.findIndex(
//           (p) => p.id === action.payload.data.id
//         );
//         if (index !== -1) {
//           state.products[index] = action.payload.data;
//         }
//       });
//   },
 
// });

// export default productSlice.reducer;


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../services/api";

// ✅ Update Product interface to include isActive
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  subCategoryId: string;
  isActive: boolean; // ✅ Add this
  subCategory?: {
    id: string;
    name: string;
  };
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// ✅ Update fetchProducts params type
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params?: { 
    page?: number; 
    limit?: number;
    search?: string;
    categoryId?: string;
    subCategoryId?: string;
    includeInactive?: boolean; // ✅ Add this
  }) => {
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

// ✅ Add toggle product status action
export const toggleProductStatus = createAsyncThunk(
  "product/toggleStatus",
  async (id: string) => {
    return await productService.toggleProductStatus(id);
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
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data.products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload.data);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.id === action.payload.data.id
        );
        if (index !== -1) {
          state.products[index] = action.payload.data;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p.id !== action.payload
        );
      })
      // ✅ Add toggle status case
      .addCase(toggleProductStatus.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.id === action.payload.data.id
        );
        if (index !== -1) {
          state.products[index] = action.payload.data;
        }
      });
  },
});

export default productSlice.reducer;