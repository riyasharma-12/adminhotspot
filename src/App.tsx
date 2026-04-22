
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Blog from "./pages/BlogManagement"
import Reviews from "./pages/ReviewManagement"
import Order from "./pages/Order"
import Setting from "./pages/Setting"

// ── Guard: redirects to /login if not authenticated as ADMIN ─────────────────
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { accessToken, user } = useSelector((state: RootState) => state.auth);

  if (!accessToken || user?.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ──────────────────────────────────────────────────────── */}
        <Route path="/login" element={<Login />} />

        {/* ── Protected (ADMIN only) ───────────────────────────────────────── */}
        <Route
          path="/*"
          element={
            <AdminRoute>
              <Layout>
                <Routes>
                  <Route path="/"            element={<Dashboard />} />
                  <Route path="/users"       element={<Users />} />
                  <Route path="/blogs"   element={<Blog />} />
                  <Route path="/reviews"    element={<Reviews />} />
                  <Route path="/orders"    element={<Order />} />
                    <Route path="/setting"    element={<Setting />} />
                </Routes>
              </Layout>
            </AdminRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;