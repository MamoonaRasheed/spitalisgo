"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import React, { useEffect } from "react";



export default function BasicTables() {

  useEffect(() => {
    console.log("i am user component")
  }, []);

  return (
    <div>
      <PageBreadcrumb pageTitle="Users Management" />
      <div className="space-y-6">
        <ComponentCard title="Users">
          <BasicTableOne/>
        </ComponentCard>
      </div>
    </div>
  );
}
