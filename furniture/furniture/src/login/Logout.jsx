import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = ({ className = "" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
  
    localStorage.removeItem("guestCart");
    localStorage.removeItem("user");
    localStorage.removeItem("isUserLoggedIn");

    
    window.dispatchEvent(new Event("userUpdated"));
    window.dispatchEvent(new Event("cartUpdated"));

    
    navigate("/", { replace: true });
  };

  return (
    <button onClick={handleLogout} className={`logout-btn ${className}`}>
      Logout
    </button>
  );
};

export default Logout;
