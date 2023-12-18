import { Navigate, Outlet, useLocation } from "react-router-dom";

function RequireAuth() {
    
    let location = useLocation();
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/login" state={{ from: location }} />;
    }
  
    return <Outlet />;
  }



export default RequireAuth