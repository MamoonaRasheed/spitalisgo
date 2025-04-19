'use client'
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getAllUsers,toggleUserStatus } from '@/services/userService';
import Badge from "../ui/badge/Badge";

interface User {
  id: number,
  name: string;
  email: string;
  status: string;
}

interface UsersResponse {
  data: User[];
}


export default function BasicTableOne() {
  const [users, setUsers] = useState<UsersResponse | null>(null); // Define state inside the component

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    try {
      await toggleUserStatus(id, currentStatus);
  
      // Update local state
      setUsers((prev) => {
        if (!prev) return prev;
        const updatedData = prev.data.map((user) =>
          user?.id === id
            ? { ...user, status: currentStatus === 'active' ? 'inactive' : 'active' }
            : user
        );
        return { ...prev, data: updatedData };
      });
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  };
  

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {users?.data.map((user, index) => (
                <TableRow key={index}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      {/* <div className="w-10 h-10 overflow-hidden rounded-full">
                        <Image
                          width={40}
                          height={40}
                          src={user.image} // Assuming each user has an 'image' property
                          alt={user.name} // Assuming each user has a 'name' property
                        />
                      </div> */}
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {user.name}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div
                      className="cursor-pointer inline-block"
                      onClick={() => handleToggleStatus(user?.id, user.status)}
                    >
                      <Badge size="sm" color={user.status === "active" ? "success" : "error"}>
                        {user.status}
                      </Badge>
                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
