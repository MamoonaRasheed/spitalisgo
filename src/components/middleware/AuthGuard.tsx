"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useUserProfile from "@/hooks/useUserProfile";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { profile, loading } = useUserProfile();
  
  // Define the state and setter function properly
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;
    
    if (profile?.role === "admin") {
      setIsAuthorized(true);  // Call the setter function correctly
      router.replace("/admin");
    } else {
      setIsAuthorized(false);  // Update the state if not authorized
      router.replace("/admin/signin");
    }
  }, [profile, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // You can optionally use `isAuthorized` to conditionally render the children or the sign-in form
  // if (isAuthorized === null) {
  //   return <SignInForm />
  // }

  return <>{children}</>;
}
