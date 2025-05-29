import ProtectedRoute from "@/components/common/ProtectedRoute";
import StudentProtectedRoute from "@/components/common/StudentProtectedRoute";
import AdminProtectedRoute from "@/components/common/AdminProtectedRoute";
import React from "react";


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (

        // <ProtectedRoute>
        // <AdminProtectedRoute>
            <StudentProtectedRoute>

                <>

                    {children}
                </>
            </StudentProtectedRoute>
        // </AdminProtectedRoute>

        // </ProtectedRoute>
    );

}