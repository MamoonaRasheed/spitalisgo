"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useUserProfile from "@/hooks/useUserProfile";
import { useRedirect } from "@/context/RedirectContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, loading } = useUserProfile();
  const { setRedirectPath } = useRedirect();

  useEffect(() => {
    if (loading) return;
    
    if (profile?.role === "admin") {
      // Authorized
    } else {
      console.log("here---------------",pathname)
      setRedirectPath(pathname);
      router.replace("/admin/signin");
    }
  }, [profile, loading, router, pathname, setRedirectPath]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
