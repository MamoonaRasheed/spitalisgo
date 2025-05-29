"use client"; // Needed if any part of this is a client component (optional here unless children use client hooks)

import React, { Suspense } from "react";
import Image from "next/image";
import StudentPublicRoute from "@/components/common/StudentPublicRoute";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentPublicRoute>
        <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
          {children}
        </div>
      </StudentPublicRoute>
    </Suspense>
  );
}
