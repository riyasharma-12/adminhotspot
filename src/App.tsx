import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "./store/store";
import LoginPage from "./components/Auth/LoginPage";
import DashboardLayout from "./components/Layout/DashboardLayout";
import Home from "./components/Home/Home";
import PrivateRoute from "./components/Auth/PrivateRoute";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/reset.css";
import CategoryForm from "./components/Category/CategoryForm";
import CategoryList from "./components/Category/CategoryList";
import SubCategoryForm from "./components/SubCategory/SubCategoryForm";
import SubCategoryList from "./components/SubCategory/SubCategoryList";
import ProductForm from "./components/Product/ProductForm";
import ProductList from "./components/Product/ProductList";
import BlogForm from "./components/Blog/BlogForm";
import BlogList from "./components/Blog/BlogList";
import BlogContentForm from "./components/BlogContent/BlogContentForm";
import BlogContentList from "./components/BlogContent/BlogContentList";

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
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="categoriesForm" element={<CategoryForm />} />
            <Route path="subcategories" element={<SubCategoryList />} />
            <Route path="subcategoriesForm" element={<SubCategoryForm />} />
            <Route path="products" element={<ProductList/>}></Route>
            <Route path="productsForm" element={<ProductForm/>}></Route>
            <Route path="blogForm" element={<BlogForm/>}></Route>
            <Route path="blogs" element={<BlogList/>}></Route>
            <Route path="blogContentForm" element={<BlogContentForm/>}></Route>
            <Route path="blogContent" element={<BlogContentList/>}></Route>
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </Provider>
  );
}

export default App;
