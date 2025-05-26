'use client'
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getChapters } from '@/services/admin/chapterService';
import Pagination from "./Pagination";

interface Data {
  id: number,
  exam_id: number;
  course_id: number;
  category_id: number;
  exam: string;
  course: string;
  category: string;
  name: string;
  sort: number;
  status: boolean;
}

interface DataResponse {
  data: Data[];
}

interface PaginationResponse {
  current_page: number;
  last_page: number;
  total: number;
}

export default function ChapterTable() {
  const [data, setData] = useState<DataResponse | null>(null); // Define state inside the component
    const [paginationData, setPaginationData] = useState<PaginationResponse | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
  

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const data = await getChapters({ page: currentPage });
        setData(data);
        setPaginationData(data);
      } catch (error) {
        console.error('Error fetching Chapters:', error);
      }
    };

    fetchChapters();
  }, [currentPage]);
  

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
                 Exam
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Course
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Category 
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Title
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
              {data?.data.map((val, index) => (
                <TableRow key={index}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {val.exam}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 ">
                    {val.course}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {val.category}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {val.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {val.status ? 'Active' : 'Inactive'} 
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex justify-center items-center px-4 py-2">
        <Pagination 
          totalPages={paginationData?.last_page ?? 0}
          currentPage={paginationData?.current_page ?? 1}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
