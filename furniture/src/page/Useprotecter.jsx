import { Navigate } from "react-router-dom";

const Useprotecter = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));


  if (user && user.role === role) return children;

  return <Navigate to="/login" replace />;
};

export default Useprotecter;
