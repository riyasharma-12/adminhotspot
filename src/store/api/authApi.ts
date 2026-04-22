import { baseApi } from "./baseApi";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email:    string;
  password: string;
}

export interface AuthUser {
  id:                 string;
  name:               string;
  email:              string;
  phone:              string;
  role:               "USER" | "ADMIN";
  isActive:           boolean;
  isEmailVerified:    boolean;
  createdAt:          string;
  updatedAt:          string;
}

export interface LoginResponse {
  accessToken:  string;
  refreshToken: string;
  user:         AuthUser;
}

// ─── Wrapper shape the API actually returns ───────────────────────────────────
interface ApiResponse<T> {
  status:     string;
  statusCode: number;
  data:       T;
  message:    string;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    login: build.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      // ↓ unwrap the { status, statusCode, data, message } envelope
      transformResponse: (response: ApiResponse<LoginResponse>) => response.data,
      invalidatesTags: ["Auth"],
    }),

    logout: build.mutation<{ message: string }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["Auth", "User"],
    }),

    getMe: build.query<AuthUser, void>({
      query: () => "/auth/me",
      transformResponse: (response: ApiResponse<AuthUser>) => response.data,
      providesTags: ["Auth"],
    }),

  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi;
