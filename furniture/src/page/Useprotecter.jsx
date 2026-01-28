import { Navigate } from "react-router-dom";

const Useprotecter = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  
  return user?.access ? children : <Navigate to="/login" replace />;
};

export default Useprotecter;
