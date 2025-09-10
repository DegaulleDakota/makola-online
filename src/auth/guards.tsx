import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/auth/session";
import { isAdminAuthed } from "@/admin/auth";

export function RequireSeller() {
  const { seller } = useAuth();
  const loc = useLocation();
  if (!seller) return <Navigate to="/seller/login" state={{ from: loc.pathname }} replace />;
  return <Outlet />;
}

export function RequireAdmin() {
  const ok = isAdminAuthed();
  const loc = useLocation();
  if (!ok) return <Navigate to="/admin/login" state={{ from: loc.pathname }} replace />;
  return <Outlet />;
}