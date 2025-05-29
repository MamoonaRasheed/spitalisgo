import GridShape from "@/components/common/GridShape";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react"; // import Suspense
import AdminPublicRoute from "@/components/common/AdminPublicRoute";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <AdminPublicRoute>
          {/* Left: Form Section */}
          <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-8 bg-white dark:bg-gray-900">
            <div className="w-full max-w-md">{children}</div>
          </div>

          {/* Right: Logo with background */}
          <div className="relative hidden lg:flex w-1/2 items-center justify-center bg-[#f4a460] dark:bg-white/5 overflow-hidden rounded-l-4xl">
            <GridShape />
            <div className="relative z-10 flex flex-col items-center">
              <Link href="/" className="mb-6">
                <Image
                  width={231}
                  height={48}
                  src="/images/logo/spitalsgo-logo.png"
                  alt="Logo"
                />
              </Link>
            </div>
          </div>
        </AdminPublicRoute>
      </Suspense>
    </div>
  );
}
