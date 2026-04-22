import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../store/api/authApi";
import { setCredentials } from "../store/api/authSlice";

export default function Login() {
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const result = await login({ email, password }).unwrap();

      // ── Role guard ─────────────────────────────────────────────────────────
      if (result.user.role !== "ADMIN") {
        setError("Access denied. Admin account required.");
        return;
      }

      dispatch(setCredentials(result));
      navigate("/", { replace: true });
    } catch (err: unknown) {
      const apiErr = err as { status?: number; data?: { message?: string } };
      if (apiErr?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError(apiErr?.data?.message ?? "Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-10 shadow-sm">

        {/* ── Logo ────────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-base font-medium text-gray-900">Admin Portal</span>
        </div>

        <h1 className="text-2xl font-medium text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-8">Sign in to your admin account to manage the platform.</p>

        {/* ── Error banner ────────────────────────────────────────────────── */}
        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* ── Email ─────────────────────────────────────────────────────── */}
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* ── Password ──────────────────────────────────────────────────── */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3 pr-10 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07A3 3 0 019.88 9.88M1 1l22 22" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* ── Submit ────────────────────────────────────────────────────── */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            {isLoading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <hr className="my-6 border-gray-100" />

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Role required</span>
          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            ADMIN only
          </span>
        </div>
      </div>
    </div>
  );
}