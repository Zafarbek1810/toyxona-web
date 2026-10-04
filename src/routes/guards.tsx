import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { paths } from "./paths";

export function CustomerGuest({ children }: { children: ReactNode }) {
  const { user, authReady } = useAppContext();
  if (!authReady) return null;
  if (user?.role === "customer") return <Navigate to={paths.account.root} replace />;
  return children;
}

export function CustomerOnly({ children }: { children: ReactNode }) {
  const { user, authReady } = useAppContext();
  if (!authReady) return null;
  if (!user || user.role !== "customer") return <Navigate to={paths.auth} replace />;
  return children;
}
