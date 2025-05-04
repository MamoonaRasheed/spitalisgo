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
        const parts = currentPath.split('/').slice(1);
        if (parts.length > 0 && parts[0].toLowerCase() === '/admin') {
          console.log("This is an admin path");
          router.push(`/admin-signin?callbackUrl=${encodeURIComponent(currentPath)}`);
        } else {
          console.log("This is not an admin path");
          router.push(`/signin?callbackUrl=${encodeURIComponent(currentPath)}`);
        }
        
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