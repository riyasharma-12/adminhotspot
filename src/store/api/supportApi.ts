
import { baseApi } from './baseApi'

export type FAQ = {
  id: string
  question: string
  answer: string
  order: number
}

export type Policy = {
  id: string
  type: string
  title: string
  content: string
}

export type HelpQuery = {
  id: string
  title: string
  description: string
  createdAt: string
}

export type AdminHelpQuery = HelpQuery & {
  user: {
    id: string
    name: string
    email: string
    phone?: string
  }
}

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ================= FAQ =================
    // getFAQs: builder.query<FAQ[], void>({
    //   query: () => '/support/faqs',
    //   providesTags: ['SupportFAQ'],
    // }),
    getFAQs: builder.query<FAQ[], void>({
  query: () => '/support/faqs',
  transformResponse: (response: { data: FAQ[] } | FAQ[]) =>
    Array.isArray(response) ? response : response.data ?? [],
  providesTags: ['SupportFAQ'],
}),

    createFAQ: builder.mutation({
      query: (body) => ({
        url: '/support/faqs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SupportFAQ'],
    }),

    updateFAQ: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/support/faqs/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['SupportFAQ'],
    }),

    deleteFAQ: builder.mutation({
      query: (id: string) => ({
        url: `/support/faqs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SupportFAQ'],
    }),

    // ================= POLICIES =================
    // getPolicies: builder.query<Policy[], void>({
    //   query: () => '/support/policies',
    //   providesTags: ['SupportPolicy'],
    // }),
    getPolicies: builder.query<Policy[], void>({
  query: () => '/support/policies',
  transformResponse: (response: { data: Policy[] } | Policy[]) =>
    Array.isArray(response) ? response : response.data ?? [],
  providesTags: ['SupportPolicy'],
}),

    getPolicyByType: builder.query<Policy, string>({
      query: (type) => `/support/policies/${type}`,
      providesTags: ['SupportPolicy'],
    }),

    upsertPolicy: builder.mutation({
      query: (body) => ({
        url: '/support/policies',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SupportPolicy'],
    }),

    deletePolicy: builder.mutation({
      query: (id: string) => ({
        url: `/support/policies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SupportPolicy'],
    }),

    // ================= USER HELP =================
   

    // ================= ADMIN HELP =================
   
  }),
})

export const {
  useGetFAQsQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,

  useGetPoliciesQuery,
  useGetPolicyByTypeQuery,
  useUpsertPolicyMutation,
  useDeletePolicyMutation,

} = supportApi