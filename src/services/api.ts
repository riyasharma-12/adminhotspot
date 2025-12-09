import axios from 'axios';
// import { AxiosProgressEvent } from 'axios';
// import { Recipient } from '../types';


// const BASE_URL = 'http://52.45.166.100:5000';
const BASE_URL = "https://streamapi.thestreamlinefactory.com";
// const BASE_URL = "http://localhost:5000";




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



export const queryService = {
  getQueries: async () => {
    const response = await api.get('/api/query/get-queries');
    return response.data;
  },
  deleteQuery: async (queryId: string) => {
    const response = await api.delete(`/api/query/delete-query/${queryId}`);
    return response.data;
  }
}



export const pageService = {
  getPage: async () => {
    const response = await api.get('/api/page/get-pages');
    // console.log("response", response);
    return response.data;
  },

  createPage: async (page: any) => {
    const response = await api.post('/api/page/create', page);
    // console.log("response", response);
    return response.data;
  },

  updatePage: async (id: string, page: any) => {
    const response = await api.patch(`/api/page/update/${id}`, page);
    // console.log("response", response);
    return response.data;
  },

  deletePage: async (id: string) => {
    // console.log("id", id);

    const response = await api.delete(`/api/page/delete/${id}`);
    // console.log("response", response);
    return response.data;
  },
}


export const productService = {
  getProducts: async () => {
    const response = await api.get('/api/product/');
    console.log("All products response:", response.data);
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await api.get(`/api/product/${id}`);
    console.log("Product response:", response.data);
    return response.data;
  },

  createProduct: async (product: any) => {
    const response = await api.post('/api/product/create', product);
    console.log("Create product response:", response.data);
    return response.data;
  },

  updateProduct: async (id: string, product: any) => {
    const response = await api.patch(`/api/product/${id}`, product);
    console.log("Update product response:", response.data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/api/product/${id}`);
    console.log("Delete product response:", response.data);
    return response.data;
  },
};


export const featureService = {
  // Get all features
  getFeatures: async () => {
    const response = await api.get("/api/feature/get-all");
    return response.data;
  },

  // Get features by product ID
  getFeaturesByProduct: async (productId: number) => {
    const response = await api.get(`/api/feature/product/${productId}`);
    return response.data;
  },

  // Get single feature by ID
  getFeatureById: async (id: number) => {
    const response = await api.get(`/api/feature/${id}`);
    return response.data;
  },

  // Create a new feature (with image upload)
  createFeature: async (formData: FormData) => {
    const response = await api.post("/api/feature/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update feature (with image support)
  updateFeature: async (id: number, formData: FormData) => {
    const response = await api.patch(`/api/feature/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Delete feature
  deleteFeature: async (id: number) => {
    const response = await api.delete(`/api/feature/${id}`);
    return response.data;
  },



};

export const categoryService = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get("/api/category");
    return response.data;
  },

  // Get single category by ID
  getCategoryById: async (id: number) => {
    const response = await api.get(`/api/category/${id}`);
    return response.data;
  },

  // Create a new category
  createCategory: async (data: { name: string }) => {
    const response = await api.post("/api/category/create", data);
    return response.data;
  },
   
 

  // Update category
  updateCategory: async (id: number, data: { name: string }) => {
    const response = await api.patch(`/api/category/${id}`, data);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: number) => {
    const response = await api.delete(`/api/category/${id}`);
    return response.data;
  },
};


export const blogService = {
  // Get all blogs
  getBlogs: async () => {
    return await api.get("/api/blog/blogs/");
  },

  // // Get blog by ID
  // getBlogById: async (id: string) => {
  //   return await api.get(`/api/blog/${id}`);
  // },

  // Create blog
  createBlog: async (blogData: FormData) => {
    return await api.post("/api/blog/blogs", blogData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Update blog
  // updateBlog: async (id: string, blogData: FormData) => {
  //   return await api.patch(`/api/blog/blogs/${id}`, blogData, {
  //     headers: { "Content-Type": "multipart/form-data" },
  //   });
  // },


  updateBlog: async (id: string, blogData: FormData) => {
  return await api.patch(`/api/blog/blogs/${id}`, blogData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
},

  // Delete blog
  deleteBlog: async (id: string) => {
    return await api.delete(`/api/blog/blogs/${id}`);
  },
};

export const aboutService = {
  // Get all about sections
  getAbout: async () => {
    const response = await api.get("/api/about/");
    return response.data;
  },

  // Get about by ID
  getAboutById: async (id: string) => {
    const response = await api.get(`/api/about/${id}`);
    return response.data;
  },

  // Create about (with video upload)
  createAbout: async (formData: FormData) => {
    const response = await api.post("/api/about/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // // Update about (with video file support)
  updateAbout: async (id: string, formData: FormData) => {
    const response = await api.patch(`/api/about/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Delete about
  deleteAbout: async (id: number | string) => {
    const response = await api.delete(`/api/about/${id}`);
    return response.data;
  },
};

export const reviewService = {
  // Get all reviews
  getReviews: async () => {
    const response = await api.get("/api/reviews/");
    return response.data;
  },

  // Get review by ID
  getReviewById: async (id: string) => {
    const response = await api.get(`/api/reviews/${id}`);
    return response.data;
  },

  // Create review (with image upload)
  createReview: async (formData: FormData) => {
    const response = await api.post("/api/reviews/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update review (image upload supported)
  updateReview: async (id: string, formData: FormData) => {
    const response = await api.patch(`/api/reviews/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Delete review
  deleteReview: async (id: string) => {
    const response = await api.delete(`/api/reviews/${id}`);
    return response.data;
  },

}


export const serviceApi = {
  
  getAllServices: async () => {
    const response = await api.get("/api/services/");
    return response.data;
  },

 
  getServiceById: async (id: number | string) => {
    const response = await api.get(`/api/services/${id}`);
    return response.data;
  },

  
  createService: async (formData: FormData) => {
    const response = await api.post("/api/services", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  
  updateService: async (id: number | string, formData: FormData) => {
    const response = await api.patch(`/api/services/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  
  deleteService: async (id: number | string) => {
    const response = await api.delete(`/api/services/${id}`);
    return response.data;
  },
};

export const founderService = {
  getFounders: async () => {
    const resp = await api.get("/api/founders");
    return resp.data;
  },

  getFounderById: async (id: number | string) => {
    const resp = await api.get(`/api/founders/${id}`);
    return resp.data;
  },

  createFounder: async (formData: FormData) => {
    const resp = await api.post("/api/founders", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return resp.data;
  },

  updateFounder: async (id: number | string, formData: FormData) => {
    const resp = await api.patch(`/api/founders/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return resp.data;
  },

  deleteFounder: async (id: number | string) => {
    const resp = await api.delete(`/api/founders/${id}`);
    return resp.data;
  },
};

export const homeService = {
  getHomes: () => api.get("/api/home"),
  createHome: (data: FormData) =>
    api.post("/api/home", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateHome: (id: number, data: FormData) =>
    api.patch(`/api/home/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteHome: (id: number) => api.delete(`/api/home/${id}`),
};

export const missionVisionApi = {
  getAll: () => api.get("/api/mission"),
  getById: (id: number) => api.get(`/api/mission/${id}`),
  create: (data: any) => api.post("/api/mission", data),
  update: (id: number, data: any) => api.put(`/api/mission/${id}`, data),
  delete: (id: number) => api.delete(`/api/mission/${id}`)
};

export  const whyChooseService = {
  create: async (data: any) => {
    const res = await api.post("/api/whychoose", data);
    return res.data.data;
  },

  getAll: async () => {
    const res = await api.get("/api/whychoose");
    return res.data.data;
  },

  getById: async (id: number) => {
    const res = await api.get(`/api/whychoose/${id}`);
    return res.data.data;
  },

  update: async (id: number, data: any) => {
    const res = await api.put(`/api/whychoose/${id}`, data);
    return res.data.data;
  },

  delete: async (id: number) => {
    const res = await api.delete(`/api/whychoose/${id}`);
    return res.data;
  },
};


export const productHeadingService = {
  getAll: async () => {
    const res = await api.get("/api/product-headings");
    return res.data;
  },

  getById: async (id: number | string) => {
    const res = await api.get(`/api/product-headings/${id}`);
    return res.data;
  },

  create: async (data: { title: string; description: string }) => {
    const res = await api.post("/api/product-headings", data);
    return res.data;
  },

  update: async (id: number | string, data: { title?: string; description?: string }) => {
    const res = await api.put(`/api/product-headings/${id}`, data);
    return res.data;
  },

  delete: async (id: number | string) => {
    const res = await api.delete(`/api/product-headings/${id}`);
    return res.data;
  },
};


export const benefitService = {
  // Get all benefits
  getBenefits: async () => {
    const response = await api.get("/api/benefit/");
    return response.data;
  },

  // Get benefit by ID
  getBenefitById: async (id: number) => {
    const response = await api.get(`/api/benefit/${id}`);
    return response.data;
  },

  // Create benefit
  createBenefit: async (data: { heading: string; description: string; items: { title: string; description: string }[] }) => {
    const response = await api.post("/api/benefit/", data);
    return response.data;
  },

  // Update benefit
  updateBenefit: async (id: number, data: { heading: string; description: string; items: { id?: number; title: string; description: string }[] }) => {
    const response = await api.put(`api/benefit/${id}`, data);
    return response.data;
  },

  // Delete benefit
  deleteBenefit: async (id: number) => {
    const response = await api.delete(`api/benefit/${id}`);
    return response.data;
  },
};







 
