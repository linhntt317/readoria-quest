import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = sessionStorage.getItem("admin_authenticated") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/admin/post-truyen" replace />;
  }

  return <>{children}</>;
};
