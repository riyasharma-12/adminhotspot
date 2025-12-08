// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { productService } from '../../services/api'; 

// interface Product {
//   id: number;
//   title: string;
//   description: string;
//   image: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ProductState {
//   products: Product[];
//   selectedProduct: Product | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ProductState = {
//   products: [],
//   selectedProduct: null,
//   loading: false,
//   error: null,
// };

// export const fetchProducts = createAsyncThunk(
//   'products/fetchProducts',
//   async () => {
//     const response = await productService.getProducts();
//     console.log("response", response);
//     return response;
//   }
// );

// const productSlice = createSlice({
//   name: 'products',
//   initialState,
//   reducers: {
//     clearSelectedProduct: (state) => {
//       state.selectedProduct = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProducts.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         //  Your data is in `action.payload.data`
//         state.products = action.payload.data || [];
//       })
//       .addCase(fetchProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || 'Failed to fetch products';
//       });
//   },
// });

// export const { clearSelectedProduct } = productSlice.actions;
// export default productSlice.reducer;
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { productService } from "../../services/api";

// // Define product interface
// interface Product {
//   id: number;
//   title: string;
//   description: string;
//   image: string;
//   createdAt: string;
//   updatedAt: string;
// }

// // Define state type
// interface ProductState {
//   products: Product[];
//   selectedProduct: Product | null;
//   loading: boolean;
//   error: string | null;
// }

// // Initial state
// const initialState: ProductState = {
//   products: [],
//   selectedProduct: null,
//   loading: false,
//   error: null,
// };

// // ✅ Fetch all products
// export const fetchProducts = createAsyncThunk(
//   "products/fetchProducts",
//   async () => {
//     const response = await productService.getProducts();
//     console.log("Fetched products:", response);
//     return response;
//   }
// );

// // ✅ Create a new product
// export const createProduct = createAsyncThunk(
//   "products/createProduct",
//   async (productData: any, { rejectWithValue }) => {
//     try {
//       const response = await productService.createProduct(productData);
//       console.log("Create product response:", response);
//       return response;
//     } catch (error: any) {
//       return rejectWithValue(error?.response?.data?.message || "Failed to create product");
//     }
//   }
// );

// // ✅ Update product
// export const updateProduct = createAsyncThunk(
//   "products/updateProduct",
//   async ({ id, product }: { id: string; product: any }, { rejectWithValue }) => {
//     try {
//       const response = await productService.updateProduct(id, product);
//       console.log("Update product response:", response);
//       return response;
//     } catch (error: any) {
//       return rejectWithValue(error?.response?.data?.message || "Failed to update product");
//     }
//   }
// );

// // ✅ Delete product
// export const deleteProduct = createAsyncThunk(
//   "products/deleteProduct",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const response = await productService.deleteProduct(id);
//       console.log("Delete product response:", response);
//       return { id, ...response };
//     } catch (error: any) {
//       return rejectWithValue(error?.response?.data?.message || "Failed to delete product");
//     }
//   }
// );

// const productSlice = createSlice({
//   name: "products",
//   initialState,
//   reducers: {
//     clearSelectedProduct: (state) => {
//       state.selectedProduct = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // ===== Fetch products =====
//       .addCase(fetchProducts.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.products = action.payload?.data || [];
//       })
//       .addCase(fetchProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || "Failed to fetch products";
//       })

//       // ===== Create product =====
//       .addCase(createProduct.fulfilled, (state, action) => {
//         state.products.push(action.payload.data);
//       })
//       .addCase(createProduct.rejected, (state, action) => {
//         state.error = action.payload as string;
//       })

//       // ===== Update product =====
//       .addCase(updateProduct.fulfilled, (state, action) => {
//         const updated = action.payload.data;
//         state.products = state.products.map((p) =>
//           p.id === updated.id ? updated : p
//         );
//       })
//       .addCase(updateProduct.rejected, (state, action) => {
//         state.error = action.payload as string;
//       })

//       // ===== Delete product =====
//       .addCase(deleteProduct.fulfilled, (state, action) => {
//         state.products = state.products.filter(
//           (p) => p.id !== Number(action.payload.id)
//         );
//       })
//       .addCase(deleteProduct.rejected, (state, action) => {
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { clearSelectedProduct } = productSlice.actions;
// export default productSlice.reducer;
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const API_URL = "http://localhost:5000/api/product";

// ✅ Create Product
// export const createProduct = createAsyncThunk(
//   "product/create",
//   async (formData: FormData, { rejectWithValue }) => {
//     try {
//       const res = await axios.post(`${API_URL}/create`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       return res.data.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Error creating product");
//     }
//   }
// );

// ✅ Update Product
// export const updateProduct = createAsyncThunk(
//   "product/update",
//   async ({ id, product }: { id: string; product: FormData }, { rejectWithValue }) => {
//     try {
//       const res = await axios.patch(`${API_URL}/update/${id}`, product, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       return res.data.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || "Error updating product");
//     }
//   }
// );

// const productSlice = createSlice({
//   name: "product",
//   initialState: {
//     products: [],
//     loading: false,
//     error: null as string | null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Create product
//       .addCase(createProduct.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createProduct.fulfilled, (state, action) => {
//         state.loading = false;
//         state.products.push(action.payload);
//       })
//       .addCase(createProduct.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // Update product
//       .addCase(updateProduct.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateProduct.fulfilled, (state, action) => {
//         state.loading = false;
//         const index = state.products.findIndex(
//           (p: any) => p.id === action.payload.id
//         );
//         if (index !== -1) state.products[index] = action.payload;
//       })
//       .addCase(updateProduct.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export default productSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const API_URL = "http://localhost:5000/api/product";
const API_URL = "https://streamapi.thestreamlinefactory.com/api/product";


// ✅ Create Product
export const createProduct = createAsyncThunk(
  "product/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
      
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error creating product");
    }
  }
);

// ✅ Update Product
export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ id, product }: { id: string; product: FormData }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`, product, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error updating product");
    }
  }
);

// ✅ Fetch All Products
export const fetchProducts = createAsyncThunk(
  "product/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}`);
      return res.data.data; // assuming backend returns { success, data: [...] }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error fetching products");
    }
  }
);

// ✅ Delete Product
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error deleting product");
    }
  }
);

// ✅ Product Slice
const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ CREATE
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ UPDATE
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p: any) => p.id === action.payload.id
        );
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ FETCH ALL
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ DELETE
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p: any) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;

