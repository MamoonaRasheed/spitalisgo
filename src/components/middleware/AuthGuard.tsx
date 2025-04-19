"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SignInForm from "@/components/admin/SignInForm";
import useUserProfile from "@/hooks/useUserProfile";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { profile, loading } = useUserProfile();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return; // Wait until profile is fetched
    console.log('Profile:', profile);   
    if (profile?.role === "admin") {
      setIsAuthorized(true);
      router.push("/admin");
    } else {
      router.push("/admin/signin");
    }
  }, [profile, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
  if(isAuthorized === null){
    return <SignInForm />
  }

  return <>{children}</>;
}
