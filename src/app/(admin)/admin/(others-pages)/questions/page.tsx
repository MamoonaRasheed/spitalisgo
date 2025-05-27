"use client"

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import QuestionTable from "@/components/tables/QuestionTable";
import addExercise from "./add/page";
import React, { useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { PlusIcon } from "@/icons";
import { useRouter } from "next/navigation";

export default function QuestionPage() {
  
  const router = useRouter();

  return (
    <div>
      <PageBreadcrumb pageTitle="Questions" />

      {/* Flex container to move button to right */}
      <div className="flex justify-end mb-4 mx-7">
        <Button size="md" variant="primary" endIcon={<PlusIcon />}
          onClick={() => router.push("/admin/questions/add")}>
          Add Question
        </Button>
      </div>

      <div className="space-y-6">
        <ComponentCard title="Questions">
          <QuestionTable />
        </ComponentCard>
      </div>
    </div>
  );
}
