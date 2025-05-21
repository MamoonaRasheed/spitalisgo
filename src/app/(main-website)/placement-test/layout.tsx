import ProtectedRoute from "@/components/common/ProtectedRoute";
import React from "react";


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (

        <ProtectedRoute>

            {children}

        </ProtectedRoute>
    );

}