import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const { customer, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F1E6]">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-2 border-[#17483F]/20 border-t-[#17483F]" />
          <span className="absolute text-xl text-[#C89A55] animate-pulse">✦</span>
        </div>
        <p className="mt-4 font-serif text-lg tracking-widest text-[#17483F]">
          ALCOVE
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#71977C]">
          Curated sanctuary
        </p>
      </div>
    );
  }

  if (!customer) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;