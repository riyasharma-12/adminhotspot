// import { baseApi } from "./baseApi";

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface User {
//   id:              string;
//   name:            string;
//   email:           string;
//   phone:           string;
//   role:            "USER" | "ADMIN";
//   isActive:        boolean;
//   isEmailVerified: boolean;
//   createdAt:       string;
//   updatedAt:       string;
// }

// export interface ListUsersParams {
//   page?:     number;
//   limit?:    number;
//   search?:   string;
//   isActive?: boolean;
// }

// export interface PaginatedUsers {
//   users:      User[];
//   total:      number;
//   page:       number;
//   limit:      number;
//   totalPages: number;
// }

// export interface ApiSuccess<T> {
//   status:     string;
//   statusCode: number;
//   message:    string;
//   data:       T;
// }

// export interface CreateUserRequest {
//   name:      string;
//   email:     string;
//   phone:     string;
//   password?: string;
// }

// export interface UpdateUserRequest {
//   name?:  string;
//   email?: string;
//   phone?: string;
// }

// export interface SetUserStatusRequest {
//   isActive: boolean;
// }

// // ─── User API ─────────────────────────────────────────────────────────────────

// export const userApi = baseApi.injectEndpoints({
//   endpoints: (build) => ({

//     // List users — paginated + searchable
//     listUsers: build.query<ApiSuccess<PaginatedUsers>, ListUsersParams>({
//       query: ({ page = 1, limit = 10, search, isActive } = {}) => {
//         const params = new URLSearchParams();
//         params.set("page",  String(page));
//         params.set("limit", String(limit));
//         if (search   !== undefined) params.set("search",   search);
//         if (isActive !== undefined) params.set("isActive", String(isActive));
//         return `/users?${params.toString()}`;
//       },
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.data.users.map(({ id }) => ({ type: "User" as const, id })),
//               { type: "User", id: "LIST" },
//             ]
//           : [{ type: "User", id: "LIST" }],
//     }),

//     // Get single user
//     getUser: build.query<ApiSuccess<User>, string>({
//       query: (userId) => `/users/${userId}`,
//       providesTags: (_r, _e, id) => [{ type: "User", id }],
//     }),

//     // Admin creates a user
//     createUser: build.mutation<ApiSuccess<User>, CreateUserRequest>({
//       query: (body) => ({ url: "/users", method: "POST", body }),
//       invalidatesTags: [{ type: "User", id: "LIST" }],
//     }),

//     // Admin updates a user
//     updateUser: build.mutation<ApiSuccess<User>, { userId: string } & UpdateUserRequest>({
//       query: ({ userId, ...body }) => ({ url: `/users/${userId}`, method: "PATCH", body }),
//       invalidatesTags: (_r, _e, { userId }) => [{ type: "User", id: userId }, { type: "User", id: "LIST" }],
//     }),

//     // Activate / deactivate
//     setUserStatus: build.mutation<ApiSuccess<User>, { userId: string; isActive: boolean }>({
//       query: ({ userId, isActive }) => ({
//         url:    `/users/${userId}/status`,
//         method: "PATCH",
//         body:   { isActive },
//       }),
//       invalidatesTags: (_r, _e, { userId }) => [{ type: "User", id: userId }, { type: "User", id: "LIST" }],
//     }),

//     // Hard delete
//     deleteUser: build.mutation<ApiSuccess<{ message: string }>, string>({
//       query: (userId) => ({ url: `/users/${userId}`, method: "DELETE" }),
//       invalidatesTags: [{ type: "User", id: "LIST" }],
//     }),

//   }),
//   overrideExisting: false,
// });

// export const {
//   useListUsersQuery,
//   useGetUserQuery,
//   useCreateUserMutation,
//   useUpdateUserMutation,
//   useSetUserStatusMutation,
//   useDeleteUserMutation,
// } = userApi;

import { baseApi } from "./baseApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id:              string;
  name:            string;
  email:           string;
  phone:           string;
  role:            "USER" | "ADMIN";
  isActive:        boolean;
  isEmailVerified: boolean;
  createdAt:       string;
  updatedAt:       string;
}

export interface ListUsersParams {
  page?:     number;
  limit?:    number;
  search?:   string;
  isActive?: boolean;
}

export interface PaginatedUsers {
  users:      User[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

// Matches your ApiResponse.success() wrapper shape
export interface ApiSuccess<T> {
  status:     string;
  statusCode: number;
  message:    string;
  data:       T;
}

export interface CreateUserRequest {
  name:      string;
  email:     string;
  phone:     string;
  password?: string;
}

export interface UpdateUserRequest {
  name?:  string;
  email?: string;
  phone?: string;
}

// ─── User API ─────────────────────────────────────────────────────────────────

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    // List users — paginated + searchable
    listUsers: build.query<ApiSuccess<PaginatedUsers>, ListUsersParams>({
      query: ({ page = 1, limit = 10, search, isActive } = {}) => {
        const params = new URLSearchParams();
        params.set("page",  String(page));
        params.set("limit", String(limit));
        if (search   !== undefined) params.set("search",   search);
        if (isActive !== undefined) params.set("isActive", String(isActive));
        return { url: "/users", params: Object.fromEntries(params) };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.users.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    // Get single user
    getUser: build.query<ApiSuccess<User>, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: (_r, _e, id) => [{ type: "User", id }],
    }),

    // Admin creates a user
    createUser: build.mutation<ApiSuccess<User>, CreateUserRequest>({
      query: (body) => ({ url: "/users", method: "POST", body }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // Admin updates a user
    updateUser: build.mutation<ApiSuccess<User>, { userId: string } & UpdateUserRequest>({
      query: ({ userId, ...body }) => ({ url: `/users/${userId}`, method: "PATCH", body }),
      invalidatesTags: (_r, _e, { userId }) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
      ],
    }),

    // Activate / deactivate
    setUserStatus: build.mutation<ApiSuccess<User>, { userId: string; isActive: boolean }>({
      query: ({ userId, isActive }) => ({
        url:    `/users/${userId}/status`,
        method: "PATCH",
        body:   { isActive },
      }),
      invalidatesTags: (_r, _e, { userId }) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
      ],
    }),

    // Hard delete
    deleteUser: build.mutation<ApiSuccess<{ message: string }>, string>({
      query: (userId) => ({ url: `/users/${userId}`, method: "DELETE" }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

  }),
  overrideExisting: false,
});

export const {
  useListUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useSetUserStatusMutation,
  useDeleteUserMutation,
} = userApi;