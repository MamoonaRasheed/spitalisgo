import { AuthProvider } from "@/context/AuthContext";

export default function AdminBaseLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div>
            <AuthProvider>
                {children}
            </AuthProvider>
        </div>

    );

}

