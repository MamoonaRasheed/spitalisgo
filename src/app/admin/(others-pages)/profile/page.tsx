"use client";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import React from "react";
import useUserProfile from "@/hooks/useUserProfile";

export default function Profile() {
  const { profile } = useUserProfile();
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard profile={profile}/>
          <UserInfoCard profile={profile}/>
          {/* <UserAddressCard profile={profile}/> */}
        </div>
      </div>
    </div>
  );
}
