import { baseApi } from "./baseApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BlogCategory {
  id:        string;
  name:      string;
  slug:      string;
  createdAt: string;
  updatedAt: string;
  _count?:   { blogs: number };
}

export interface Blog {
  id:          string;
  title:       string;
  description: string;
  image:       string;
  authorName:  string;
  authorImage: string;
  date:        string;
  categoryId:  string;
  category:    BlogCategory;
  createdAt:   string;
  updatedAt:   string;
}

export interface PaginatedBlogs {
  data: Blog[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface BlogQuery {
  page?:       number;
  limit?:      number;
  categoryId?: string;
  search?:     string;
}

export interface CreateCategoryBody { name: string; slug: string }
export interface UpdateCategoryBody { name?: string; slug?: string }

export interface CreateBlogBody {
  title:       string;
  description: string;
  image:       string;
  authorName:  string;
  authorImage: string;
  categoryId:  string;
  date?:       string;
}
export interface UpdateBlogBody extends Partial<CreateBlogBody> {}

// ─── Inject into baseApi ──────────────────────────────────────────────────────

export const blogApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Blog", "Category"] })
  .injectEndpoints({
    endpoints: (builder) => ({

      // ── Categories ────────────────────────────────────────────────────────

      getAllCategories: builder.query<BlogCategory[], void>({
        query: () => "/blogs/categories",
        transformResponse: (res: any) => res.data,
        providesTags: [{ type: "Category", id: "LIST" }],
      }),

      getCategoryById: builder.query<BlogCategory, string>({
        query: (id) => `/blogs/categories/${id}`,
        transformResponse: (res: any) => res.data,
        providesTags: (_r, _e, id) => [{ type: "Category", id }],
      }),

      createCategory: builder.mutation<BlogCategory, CreateCategoryBody>({
        query: (body) => ({ url: "/blogs/categories", method: "POST", body }),
        transformResponse: (res: any) => res.data,
        invalidatesTags: [{ type: "Category", id: "LIST" }],
      }),

      updateCategory: builder.mutation<BlogCategory, { id: string; body: UpdateCategoryBody }>({
        query: ({ id, body }) => ({ url: `/blogs/categories/${id}`, method: "PATCH", body }),
        transformResponse: (res: any) => res.data,
        invalidatesTags: (_r, _e, { id }) => [
          { type: "Category", id },
          { type: "Category", id: "LIST" },
        ],
      }),

      deleteCategory: builder.mutation<{ message: string }, string>({
        query: (id) => ({ url: `/blogs/categories/${id}`, method: "DELETE" }),
        transformResponse: (res: any) => res.data,
        invalidatesTags: [{ type: "Category", id: "LIST" }],
      }),

      // ── Blogs ─────────────────────────────────────────────────────────────

      getAllBlogs: builder.query<PaginatedBlogs, BlogQuery>({
        query: (params = {}) => ({ url: "/blogs", params }),
        transformResponse: (res: any) => res.data,
        providesTags: (result) =>
          result
            ? [
                ...result.data.map(({ id }) => ({ type: "Blog" as const, id })),
                { type: "Blog", id: "LIST" },
              ]
            : [{ type: "Blog", id: "LIST" }],
      }),

      getBlogById: builder.query<Blog, string>({
        query: (id) => `/blogs/${id}`,
        transformResponse: (res: any) => res.data,
        providesTags: (_r, _e, id) => [{ type: "Blog", id }],
      }),

      createBlog: builder.mutation<Blog, CreateBlogBody>({
        query: (body) => ({ url: "/blogs", method: "POST", body }),
        transformResponse: (res: any) => res.data,
        invalidatesTags: [{ type: "Blog", id: "LIST" }],
      }),

      updateBlog: builder.mutation<Blog, { id: string; body: UpdateBlogBody }>({
        query: ({ id, body }) => ({ url: `/blogs/${id}`, method: "PATCH", body }),
        transformResponse: (res: any) => res.data,
        invalidatesTags: (_r, _e, { id }) => [
          { type: "Blog", id },
          { type: "Blog", id: "LIST" },
        ],
      }),

      deleteBlog: builder.mutation<{ message: string }, string>({
        query: (id) => ({ url: `/blogs/${id}`, method: "DELETE" }),
        transformResponse: (res: any) => res.data,
        invalidatesTags: (_r, _e, id) => [
          { type: "Blog", id },
          { type: "Blog", id: "LIST" },
        ],
      }),
    }),
  });

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;