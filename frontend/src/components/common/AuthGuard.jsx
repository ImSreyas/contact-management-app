import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthGuard({ children }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
