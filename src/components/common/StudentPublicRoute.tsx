"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const StudentPublicRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const checkPublic = () => {
      if (!isMounted) return;

      if (user) {
        // Check for callbackUrl
        const callbackUrl = searchParams.get("callbackUrl");
        if (callbackUrl) {
          router.push(callbackUrl); // Redirect to where the user came from
        } else {
          router.push("/"); // Default fallback
        }
      } else {
        setIsLoading(false);
      }
    };

    checkPublic();
  }, [user, router, isMounted, searchParams]);

  if (!isMounted || isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default StudentPublicRoute;
