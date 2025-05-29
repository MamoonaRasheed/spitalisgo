"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/loader/Loader";

const StudentProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const currentPath = window.location.pathname;
    const encodedPath = encodeURIComponent(currentPath);

    if (!user) {
      router.push(`/signin?callbackUrl=${encodedPath}`);
    }else {
      setIsLoading(false);
    }
  }, [user, isMounted, router]);

  if (!isMounted || isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><LoadingSpinner /></div>;
  }

  return <>{children}</>;
};

export default StudentProtectedRoute;
