import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function PublicRoute({ children }) {
  const { customer, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F1E6]">
        <span className="text-2xl text-[#C89A55] animate-pulse">✦</span>
      </div>
    );
  }

  if (customer) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default PublicRoute;