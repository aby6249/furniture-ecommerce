import { Link, Outlet } from "react-router-dom";
import Logout from "../login/Logout"; 
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-container">
      <div className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>

        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className="nav-link">
            Dashboard
          </Link>

          <Link to="/admin/products" className="nav-link">
            Manage Products
          </Link>

          <Link to="/admin/users" className="nav-link">
            Manage Users
          </Link>

          <Logout />
        </nav>
      </div>

      <main className="main-content">
        <h1 className="welcome-text">
          <b>Welcome Admin,</b>
        </h1>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
