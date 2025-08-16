import { Link, Outlet } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  // const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="admin-container">
      <div className="sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <nav className="sidebar-nav">
          <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/admin/products" className="nav-link">Manage Products</Link>
          <Link to="/admin/users" className="nav-link">Manage Users</Link>
          {/* <Link to="/admin/addProducts" className="nav-link">Add Products</Link> */}
          <button onClick={logout} className="logout-btn"><b>Logout</b></button>
        </nav>
      </div>

      <main className="main-content">
        <h1 className="welcome-text"><b>Welcome Admin,</b></h1>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
