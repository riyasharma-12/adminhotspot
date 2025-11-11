import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "./store/store";
import LoginPage from "./components/Auth/LoginPage";
import DashboardLayout from "./components/Layout/DashboardLayout";
import UserList from "./components/Users/UserList";
import PageList from "./components/Pages/PageList";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Home from "./components/Home/Home";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import QueryList from "./components/Querys/QueryList";
import PageForm from "./components/Pages/PageForm";
import ProductForm from "./components/Product/ProductForm";
import ProductList from "./components/Product/ProductList";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard/home" replace />} />
            <Route path="users" element={<UserList />} />
            <Route path="home" element={<Home />} />
            <Route path="pages" element={<PageList />} />
            <Route path="pagesForm" element={<PageForm />} />
            <Route path="queries" element={<QueryList />} />
            <Route path="products" element={<ProductList />} />
            <Route path="productsForm" element={<ProductForm />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </Provider>
  );
}

export default App;
