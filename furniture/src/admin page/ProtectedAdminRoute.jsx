import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
