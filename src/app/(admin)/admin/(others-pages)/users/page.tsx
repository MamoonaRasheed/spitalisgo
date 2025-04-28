"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import LoadingSpinner from "@/components/loader/Loader"; // assuming you have a LoadingSpinner component
import React, { useEffect, useState } from "react";

export default function BasicTables() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("i am user component");
    
    // simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second delay to simulate loading
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Users Management" />
      <div className="space-y-6">
        <ComponentCard title="Users">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
