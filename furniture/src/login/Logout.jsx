import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ className = "" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

 
    window.dispatchEvent(new Event("userUpdated"));
    window.dispatchEvent(new Event("cartUpdated"));

 
    navigate("/login", { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`logout-btn ${className}`}
    >
      Logout
    </button>
  );
};

export default Logout;
