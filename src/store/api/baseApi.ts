// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type { RootState } from "../index";

// export const baseApi = createApi({
//   reducerPath: "api",
//   baseQuery: fetchBaseQuery({
//     baseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:4008/api/v1",
//     prepareHeaders: (headers, { getState }) => {
//       const token = (getState() as RootState).auth.accessToken;
//       if (token) headers.set("Authorization", `Bearer ${token}`);
//       return headers;
//     },
//   }),
//   tagTypes: ["User", "Auth", "Blog", "Category", "Review"],
//   endpoints: () => ({}),
// });


import { createApi, fetchBaseQuery, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { RootState } from "../index";

// ─── Base query with auth header ──────────────────────────────────────────────

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:4008/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// ─── Wrapper that retries once after refreshing an expired token ──────────────

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    // Try to get a new access token using the refresh token from Redux state
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        {
          url:    "/auth/refresh-token",
          method: "POST",
          body:   { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Persist new access token — dispatch to your auth slice
        const newAccessToken = (refreshResult.data as any).data?.accessToken;
        if (newAccessToken) {
          // Import and dispatch your setAccessToken action here, e.g.:
          // api.dispatch(setAccessToken(newAccessToken));
          //
          // ── Or if you store tokens in localStorage as a fallback: ──
          localStorage.setItem("accessToken", newAccessToken);
        }

        // Retry original request with the new token
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        // Refresh failed — token truly expired, force logout
        // api.dispatch(logout());
      }
    }
  }

  return result;
};

// ─── Base API ─────────────────────────────────────────────────────────────────

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery:   baseQueryWithReauth,   // ← replaces plain fetchBaseQuery
  tagTypes:    ["User", "Auth","SupportFAQ", "SupportPolicy"],
  endpoints:   () => ({}),
});