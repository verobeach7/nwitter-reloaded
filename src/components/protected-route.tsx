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
  // firebase에 user가 있는지 확인(있다면 User 반환, 없다면 null 반환)
  const user = auth.currentUser;
  // console.log(user); // user가 로그인되어있는지 여부를 확인할 수 있음
  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children;
}
