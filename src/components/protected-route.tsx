import React from "react";
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";

// React의 모든 컴포넌트는 children을 가짐
export default function ProtectedRoute({
  children,
}: {
  // TypeScript: children의 타입은 React.ReactNode임
  children: React.ReactNode;
}) {
  const user = auth.currentUser;
  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children;
}
