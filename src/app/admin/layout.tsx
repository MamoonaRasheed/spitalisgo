"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useUserProfile from "@/hooks/useUserProfile";
import SignInForm from "@/components/admin/SignInForm";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
 const { profile, loading } = useUserProfile();
 const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";


  useEffect(() => {
    // if (loading) return;
    console.log('profile?.role ', profile?.role )
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
    );
  }
  
  if (isAuthorized === true) {
    return (
      <div className="min-h-screen xl:flex">
        <AppSidebar />
        <Backdrop />
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          <AppHeader />
          <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
            {children}
          </div>
        </div>
      </div>
    );
  } else {
    return <SignInForm />;
  }
  
}
