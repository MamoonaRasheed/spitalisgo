"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ExerciseTable from "@/components/tables/ExerciseTable";
import addExercise from "./add/page";
import React, { useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { useRouter } from "next/navigation";

export default function BasicTables() {
  
  const router = useRouter();

  return (
    <div>
      <PageBreadcrumb pageTitle="Exercises" />

      {/* Flex container to move button to right */}
      <div className="flex justify-end mb-4 mx-7">
        <Button size="md" variant="primary" endIcon={<PlusIcon />}
          onClick={() => router.push("/admin/exercise/add")}>
          Add
        </Button>
      </div>

      <div className="space-y-6">
        <ComponentCard title="Exercises">
          <ExerciseTable />
        </ComponentCard>
      </div>
    </div>
  );
}
