"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      if (!isMounted) return;

      if (!user) {
        const currentPath = window.location.pathname;
        router.push(`/admin-signin?callbackUrl=${encodeURIComponent(currentPath)}`);
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [user, router, isMounted]);

  if (!isMounted || isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
