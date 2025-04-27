"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const checkPublic = () => {
      if (!isMounted) return;

      if (user) {
        // ✅ If user is already logged in, redirect to /admin
        router.push("/admin");
      } else {
        setIsLoading(false);
      }
    };

    checkPublic();
  }, [user, router, isMounted]);

  if (!isMounted || isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default PublicRoute;
