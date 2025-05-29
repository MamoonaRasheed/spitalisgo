"use client"
import GridShape from "@/components/common/GridShape";
import Button from "@/components/ui/button/Button";

import React from "react";
import { useRouter } from "next/navigation";

export default function Unauthorized() {
    const router = useRouter();
    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        router.push("/");
    };
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
            <GridShape />
            <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
                <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
                    Unauthorized
                </h1>

                <Button onClick={handleSignOut}>
                    Logout
                </Button>
            </div>

        </div>
    );
}
