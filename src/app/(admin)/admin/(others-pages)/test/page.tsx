"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import React, { useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { useRouter } from "next/navigation";





export default function BasicTables() {
  useEffect(() => {
    console.log("i am chapter component");
  }, []);
  const router = useRouter();


  return (
    <div>
      <PageBreadcrumb pageTitle="Chapter Management" />

      {/* Flex container to move button to right */}
      <div className="flex justify-end mb-4 mx-7">
        <Button size="md" variant="primary" endIcon={<PlusIcon />}
          onClick={() => router.push("/admin/add-chapter")}>
          Add
        </Button>
      </div>

      <div className="space-y-6">
        <ComponentCard title="Users">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
