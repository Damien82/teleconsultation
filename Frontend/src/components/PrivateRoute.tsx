import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

export default function PrivateRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string;
}) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />;
  if (user.role !== role) return <Navigate to="/" />;

  return <>{children}</>;
}
