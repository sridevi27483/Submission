// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";


const PrivateRoute = ({ roles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(userRole)) return <Navigate to="/accounts" replace />;


  return <Outlet />;
};

export default PrivateRoute;
