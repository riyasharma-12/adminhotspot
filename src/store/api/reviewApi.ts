// import { baseApi } from "./baseApi";


// // ─── Types ────────────────────────────────────────────────────────────────────

// export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

// export interface ReviewUser {
//   id:    string;
//   name:  string;
//   email?: string;
// }

// export interface Review {
//   id:             string;
//   userId:         string;
//   user:           ReviewUser;
//   rating:         number;
//   title:          string;
//   body:           string;
//   status:         ReviewStatus;
//   rejectedReason: string | null;
//   reviewedAt:     string | null;
//   createdAt:      string;
//   updatedAt:      string;
// }

// export interface PaginatedReviews {
//   data: Review[];
//   meta: { total: number; page: number; limit: number; totalPages: number };
// }

// export interface ReviewQuery {
//   page?:   number;
//   limit?:  number;
//   status?: ReviewStatus;
//   rating?: number;
// }

// export interface CreateReviewBody {
//   rating: number;
//   title:  string;
//   body:   string;
// }

// export interface UpdateReviewBody {
//   rating?: number;
//   title?:  string;
//   body?:   string;
// }

// export interface UpdateReviewStatusBody {
//   status:          "APPROVED" | "REJECTED";
//   rejectedReason?: string;
// }

// // ─── Inject into baseApi ──────────────────────────────────────────────────────

// export const reviewApi = baseApi
//   .enhanceEndpoints({ addTagTypes: ["Review"] })
//   .injectEndpoints({
//     endpoints: (builder) => ({

//       // ── Public ─────────────────────────────────────────────────────────────

//       getPublicReviews: builder.query<PaginatedReviews, ReviewQuery | void>({
//         query: (params = {}) => ({ url: "/reviews", params }),
//         transformResponse: (res: any) => res.data,
//         providesTags: (result) =>
//           result
//             ? [
//                 ...result.data.map(({ id }) => ({ type: "Review" as const, id })),
//                 { type: "Review", id: "PUBLIC_LIST" },
//               ]
//             : [{ type: "Review", id: "PUBLIC_LIST" }],
//       }),

//       getPublicReviewById: builder.query<Review, string>({
//         query: (id) => `/reviews/${id}`,
//         transformResponse: (res: any) => res.data,
//         providesTags: (_r, _e, id) => [{ type: "Review", id }],
//       }),

//       // ── Authenticated user ─────────────────────────────────────────────────

//       submitReview: builder.mutation<Review, CreateReviewBody>({
//         query: (body) => ({ url: "/reviews", method: "POST", body }),
//         transformResponse: (res: any) => res.data,
//         invalidatesTags: [
//           { type: "Review", id: "MY_LIST" },
//           { type: "Review", id: "ADMIN_LIST" },
//         ],
//       }),

//       getMyReviews: builder.query<PaginatedReviews, ReviewQuery | void>({
//         query: (params = {}) => ({ url: "/reviews/me", params }),
//         transformResponse: (res: any) => res.data,
//         providesTags: (result) =>
//           result
//             ? [
//                 ...result.data.map(({ id }) => ({ type: "Review" as const, id })),
//                 { type: "Review", id: "MY_LIST" },
//               ]
//             : [{ type: "Review", id: "MY_LIST" }],
//       }),

//       updateMyReview: builder.mutation<Review, { id: string; body: UpdateReviewBody }>({
//         query: ({ id, body }) => ({ url: `/reviews/${id}/me`, method: "PATCH", body }),
//         transformResponse: (res: any) => res.data,
//         invalidatesTags: (_r, _e, { id }) => [
//           { type: "Review", id },
//           { type: "Review", id: "MY_LIST" },
//         ],
//       }),

//       deleteMyReview: builder.mutation<{ message: string }, string>({
//         query: (id) => ({ url: `/reviews/${id}/me`, method: "DELETE" }),
//         transformResponse: (res: any) => res.data,
//         invalidatesTags: (_r, _e, id) => [
//           { type: "Review", id },
//           { type: "Review", id: "MY_LIST" },
//         ],
//       }),

//       // ── Admin ──────────────────────────────────────────────────────────────

//       adminGetAllReviews: builder.query<PaginatedReviews, ReviewQuery | void>({
//         query: (params = {}) => ({ url: "/reviews/admin", params }),
//         transformResponse: (res: any) => res.data,
//         providesTags: (result) =>
//           result
//             ? [
//                 ...result.data.map(({ id }) => ({ type: "Review" as const, id })),
//                 { type: "Review", id: "ADMIN_LIST" },
//               ]
//             : [{ type: "Review", id: "ADMIN_LIST" }],
//       }),

//       adminUpdateReviewStatus: builder.mutation<Review, { id: string; body: UpdateReviewStatusBody }>({
//         query: ({ id, body }) => ({ url: `/reviews/admin/${id}/status`, method: "PATCH", body }),
//         transformResponse: (res: any) => res.data,
//         invalidatesTags: (_r, _e, { id }) => [
//           { type: "Review", id },
//           { type: "Review", id: "ADMIN_LIST" },
//           { type: "Review", id: "PUBLIC_LIST" },
//         ],
//       }),

//       adminDeleteReview: builder.mutation<{ message: string }, string>({
//         query: (id) => ({ url: `/reviews/admin/${id}`, method: "DELETE" }),
//         transformResponse: (res: any) => res.data,
//         invalidatesTags: (_r, _e, id) => [
//           { type: "Review", id },
//           { type: "Review", id: "ADMIN_LIST" },
//           { type: "Review", id: "PUBLIC_LIST" },
//         ],
//       }),
//     }),
//   });

// export const {
//   useGetPublicReviewsQuery,
//   useGetPublicReviewByIdQuery,
//   useSubmitReviewMutation,
//   useGetMyReviewsQuery,
//   useUpdateMyReviewMutation,
//   useDeleteMyReviewMutation,
//   useAdminGetAllReviewsQuery,
//   useAdminUpdateReviewStatusMutation,
//   useAdminDeleteReviewMutation,
// } = reviewApi;

import { baseApi } from "./baseApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ReviewUser {
  id:     string;
  name:   string;
  email?: string;
}

export interface Review {
  id:             string;
  userId:         string;
  user:           ReviewUser;
  rating:         number;
  title:          string;
  body:           string;
  status:         ReviewStatus;
  rejectedReason: string | null;
  reviewedAt:     string | null;
  createdAt:      string;
  updatedAt:      string;
}

export interface PaginatedReviews {
  data: Review[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ── Concrete type — never void — so params is always Record<string, any> ──────
export interface ReviewQuery {
  page?:   number;
  limit?:  number;
  status?: ReviewStatus;
  rating?: number;
}

export interface CreateReviewBody {
  rating: number;
  title:  string;
  body:   string;
}

export interface UpdateReviewBody {
  rating?: number;
  title?:  string;
  body?:   string;
}

export interface UpdateReviewStatusBody {
  status:          "APPROVED" | "REJECTED";
  rejectedReason?: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const reviewApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["Review"] })
  .injectEndpoints({
    endpoints: (build) => ({

      // ── Public ──────────────────────────────────────────────────────────────

      getPublicReviews: build.query<PaginatedReviews, ReviewQuery>({
        query: (params) => ({ url: "/reviews", params }),
        transformResponse: (res: any) => res.data,
        providesTags: (result) =>
          result
            ? [...result.data.map(({ id }) => ({ type: "Review" as const, id })), { type: "Review", id: "PUBLIC_LIST" }]
            : [{ type: "Review", id: "PUBLIC_LIST" }],
      }),

      getPublicReviewById: build.query<Review, string>({
        query: (id) => `/reviews/${id}`,
        transformResponse: (res: any) => res.data,
        providesTags: (_r, _e, id) => [{ type: "Review", id }],
      }),

      // ── Authenticated user ───────────────────────────────────────────────────

      submitReview: build.mutation<Review, CreateReviewBody>({
        query: (body) => ({ url: "/reviews", method: "POST", body }),
        transformResponse: (res: any) => res.data,
        invalidatesTags: [
          { type: "Review", id: "MY_LIST" },
          { type: "Review", id: "ADMIN_LIST" },
        ],
      }),

      getMyReviews: build.query<PaginatedReviews, ReviewQuery>({
        query: (params) => ({ url: "/reviews/mine", params }),
        transformResponse: (res: any) => res.data,
        providesTags: (result) =>
          result
            ? [...result.data.map(({ id }) => ({ type: "Review" as const, id })), { type: "Review", id: "MY_LIST" }]
            : [{ type: "Review", id: "MY_LIST" }],
      }),

      updateMyReview: build.mutation<Review, { id: string; body: UpdateReviewBody }>({
        query: ({ id, body }) => ({ url: `/reviews/mine/${id}`, method: "PATCH", body }),
        transformResponse: (res: any) => res.data,
        invalidatesTags: (_r, _e, { id }) => [
          { type: "Review", id },
          { type: "Review", id: "MY_LIST" },
        ],
      }),

      deleteMyReview: build.mutation<{ message: string }, string>({
        query: (id) => ({ url: `/reviews/mine/${id}`, method: "DELETE" }),
        transformResponse: (res: any) => res.data,
        invalidatesTags: (_r, _e, id) => [
          { type: "Review", id },
          { type: "Review", id: "MY_LIST" },
        ],
      }),

      // ── Admin ────────────────────────────────────────────────────────────────

      adminGetAllReviews: build.query<PaginatedReviews, ReviewQuery>({
        query: (params) => ({ url: "/reviews/admin", params }),
        transformResponse: (res: any) => res.data,
        providesTags: (result) =>
          result
            ? [...result.data.map(({ id }) => ({ type: "Review" as const, id })), { type: "Review", id: "ADMIN_LIST" }]
            : [{ type: "Review", id: "ADMIN_LIST" }],
      }),

      adminUpdateReviewStatus: build.mutation<Review, { id: string; body: UpdateReviewStatusBody }>({
        query: ({ id, body }) => ({ url: `/reviews/admin/${id}/status`, method: "PATCH", body }),
        transformResponse: (res: any) => res.data,
        invalidatesTags: (_r, _e, { id }) => [
          { type: "Review", id },
          { type: "Review", id: "ADMIN_LIST" },
          { type: "Review", id: "PUBLIC_LIST" },
        ],
      }),

      adminDeleteReview: build.mutation<{ message: string }, string>({
        query: (id) => ({ url: `/reviews/admin/${id}`, method: "DELETE" }),
        transformResponse: (res: any) => res.data,
        invalidatesTags: (_r, _e, id) => [
          { type: "Review", id },
          { type: "Review", id: "ADMIN_LIST" },
          { type: "Review", id: "PUBLIC_LIST" },
        ],
      }),

    }),
    overrideExisting: false,
  });

export const {
  useGetPublicReviewsQuery,
  useGetPublicReviewByIdQuery,
  useSubmitReviewMutation,
  useGetMyReviewsQuery,
  useUpdateMyReviewMutation,
  useDeleteMyReviewMutation,
  useAdminGetAllReviewsQuery,
  useAdminUpdateReviewStatusMutation,
  useAdminDeleteReviewMutation,
} = reviewApi;