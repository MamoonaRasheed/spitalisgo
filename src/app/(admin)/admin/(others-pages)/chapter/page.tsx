"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ChapterTable from "@/components/tables/ChapterTable";
import addExercise from "./add/addExercise";
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
      <PageBreadcrumb pageTitle="Exercises" />

      {/* Flex container to move button to right */}
      <div className="flex justify-end mb-4 mx-7">
        <Button size="md" variant="primary" endIcon={<PlusIcon />}
          onClick={() => router.push("/admin/add-exercise")}>
          Add
        </Button>
      </div>

      <div className="space-y-6">
        <ComponentCard title="Exercises">
          <ChapterTable />
        </ComponentCard>
      </div>
    </div>
  );
}
