'use client'
import React, { useEffect, useState } from "react";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import { getAllUsers } from '@/services/userService';
import RecentOrders from "@/components/ecommerce/RecentOrders";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/loader/Loader";

interface User {
  id: number;
  name: string;
  email: string;
  status: "active" | "inactive";
}

interface UsersResponse {
  data: User[];
  user_count: number;
}

export default function Ecommerce() {
  const [users, setUsers] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();


  useEffect(() => {
    console.log("in page admin page.tsx")
    console.log("admin details-------", user)
  })

  useEffect(() => { //fetches users on dashboard home page
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fallback if users are not loaded yet
  if (users === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <EcommerceMetrics count={users.user_count} />
      </div>

      <div className="col-span-12">
        <RecentOrders users={users.data} />
      </div>
    </div>
  );
}
