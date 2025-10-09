import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  isLoggedIn: boolean;
  children: JSX.Element;
}

export default function ProtectedRoute({ isLoggedIn, children }: ProtectedRouteProps) {
  // ถ้าไม่ได้ login → redirect ไปหน้า login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  // ถ้า login → render component ที่ต้องการ
  return children;
}
