import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requiredRoles = [] }) {
  const { isAuthenticated, user, loading, hasRole } = useAuth();

  // If still loading auth state, show loading indicator
  if (loading) {
    return <div>Cargando...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/sesion" replace />;
  }

  // If roles are specified and user doesn't have required role
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    // Redirect to dashboard or unauthorized page
    return <Navigate to="/" replace />;
  }

  // If authenticated and authorized, render the component
  return children;
}

