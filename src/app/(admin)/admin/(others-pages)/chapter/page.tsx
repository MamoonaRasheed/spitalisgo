"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ChapterTable from "@/components/tables/ChapterTable";
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
      <PageBreadcrumb pageTitle="Chapter" />

      <div className="space-y-6">
        <ComponentCard title="Chapter">
          <ChapterTable />
        </ComponentCard>
      </div>
    </div>
  );
}
