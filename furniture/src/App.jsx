import './App.css';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Home from './create/Home';
import Footer from './home page/Footer';
import Navbar from './home page/Navbar';

import Login from './login/Login';
import Register from './login/Register';

import Useprotecter from './page/Useprotecter';
import UserPage from './page/UserPage';
import ProductList from './product/ProductList';
import ProductDetail from './product/ProductDetail';
import AddToCart from './product/AddToCart';
import PaymentPage from './payment/PaymentPage';
import Orders from './payment/order';

import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ProtectedAdminRoute from './admin page/ProtectedAdminRoute';
import AdminDashboard from './admin page/AdminDashboard';
import DashboardHome from './admin page/DashboardHome';
import ManageProducts from './admin page/ManageProducts';
import ManageUsers from './admin page/ManageUsers';

function App() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={isAdmin ? <Navigate to="/admin" /> : <Home />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/products"
          element={isAdmin ? <Navigate to="/admin" /> : <ProductList />}
        />
        <Route
          path="/products/:id"
          element={isAdmin ? <Navigate to="/admin" /> : <ProductDetail />}
        />

        <Route
          path="/cart"
          element={isAdmin ? <Navigate to="/admin" /> : <AddToCart />}
        />
        

        <Route
          path="/payment"
          element={
            <Useprotecter role="user">
              <PaymentPage />
            </Useprotecter>
          }
        />
        <Route
          path="/orders"
          element={
            <Useprotecter role="user">
              <Orders />
            </Useprotecter>
          }
        />
        <Route
          path="/user"
          element={
            <Useprotecter role="user">
              <UserPage />
            </Useprotecter>
          }
        />

        {/* <<<<< Admin Routes>>>>> */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>
        </Route>
      </Routes>

      {!hideLayout && <Footer />}
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
}

export default App;
