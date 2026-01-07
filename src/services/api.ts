import axios from 'axios';
// import { AxiosProgressEvent } from 'axios';
// import { Recipient } from '../types';


// const BASE_URL = 'http://52.45.166.100:5000';
const BASE_URL = "http://localhost:5000";
// const BASE_URL = "https://api.aiendri.com";




const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/api/admin/login', credentials);
    // console.log("response", response);
    return response.data;
  },
};

export const userService = {
  getUsers: async () => {
    const response = await api.get('/api/user/get-users');
    // console.log("response users ", response);
    return response.data;

  },

 

  deleteUser: async (userId: string, payload: any, ) => {
    console.log("userId", userId, "payload", payload);
    
    const response = await api.delete(`/api/admin/delete-user/${userId}`, { data: payload });
    // console.log("response", response);

    return response.data;
  },

 

  sendEmail: async (emailData: { email: any, subject: string, content: string }) => {
    // console.log("emailData", emailData);
    const response = await api.post('/api/admin/send-email', emailData);
    return response.data;
  },

};

export const categoryService = {
  getCategories: async (params?: any) => {
    const response = await api.get("/api/category", { params });
    return response.data;
  },

  createCategory: async (payload: { name: string }) => {
    const response = await api.post("/api/category", payload);
    return response.data;
  },

  updateCategory: async (id: string, payload: { name: string }) => {
    const response = await api.patch(`/api/category/${id}`, payload);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await api.delete(`/api/category/${id}`);
    return response.data;
  },
};


export const subCategoryService = {
  // GET ALL (with optional filters)
  getSubCategories: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
  }) => {
    const response = await api.get("/api/subcategory", { params });
    return response.data;
  },

  // CREATE
  createSubCategory: async (payload: {
    name: string;
    categoryId: string;
  }) => {
    const response = await api.post("/api/subcategory", payload);
    return response.data;
  },

  // UPDATE
  updateSubCategory: async (
    id: string,
    payload: { name: string; categoryId: string }
  ) => {
    const response = await api.patch(`/api/subcategory/${id}`, payload);
    return response.data;
  },

  // DELETE
  deleteSubCategory: async (id: string) => {
    const response = await api.delete(`/api/subcategory/${id}`);
    return response.data;
  },
};

export const productService = {
  getProducts: async (params?: any) => {
    const response = await api.get("/api/product", { params });
    return response.data;
  },

  createProduct: async (payload: FormData) => {
    const response = await api.post("/api/product", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateProduct: async (id: string, payload: FormData) => {
    const response = await api.patch(`/api/product/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/api/product/${id}`);
    return response.data;
  },
};

export const blogService = {
  getBlogs: async (params?: any) => {
    const response = await api.get("/api/blog", { params });
    return response.data;
  },

  getBlogById: async (id: string) => {
    const response = await api.get(`/api/blog/${id}`);
    return response.data;
  },

  createBlog: async (data: FormData) => {
    const response = await api.post("/api/blog", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // ✅ IMPORTANT
  },

  updateBlog: async (id: string, data: FormData) => {
    const response = await api.patch(`/api/blog/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; 
  },

  deleteBlog: async (id: string) => {
    const response = await api.delete(`/api/blog/${id}`);
    return response.data;
  },
};



export interface BlogContentImage {
  image: string;
  order: number;
}

export interface BlogContent {
  id: string;
  blogId: string;
  description: string;
  order: number;
  images: BlogContentImage[];
}

export const blogContentService = {
  getContentsByBlogId: async (blogId: string) => {
    const response = await api.get(`/api/blogContent/${blogId}`);
    return response.data;
  },

  createContent: async (payload: FormData) => {
    const response = await api.post("/api/blogContent", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getAllContents: async () => {
    const response = await api.get(`/api/blogContent/`); // assumes your backend route for all contents is GET /api/blogContent
    return response.data;
  },

  updateContent: async (id: string, payload: FormData) => {
    const response = await api.patch(`/api/blogContent/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteContent: async (id: string) => {
    const response = await api.delete(`/api/blogContent/${id}`);
    return response.data;
  },
};
