
// src/components/crm/CRMProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function CRMProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050d1a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/crm/login" replace />;
  }

  return <>{children}</>;
}
