'use client'

import React, { useEffect, useState } from "react";

import Swal from 'sweetalert2';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getExercises, deleteExercises } from '@/services/admin/excerciseService';
import Link from "next/link";
import Pagination from "./Pagination";

interface Exercise {
  id: number,
  title: string;
  excercise_no: string;
  chapter_id: string;
  status: boolean;
  chapter: {
    id: number;
    name: string;
  };
}

interface ExercisesResponse {
  data: Exercise[];
}

interface PaginationResponse {
  current_page: number;
  last_page: number;
  total: number;
}

export default function ExercisesTable() {
  const [exercises, setExercises] = useState<ExercisesResponse | null>(null); 
  const [paginationData, setPaginationData] = useState<PaginationResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const fetchExercises = async () => {
    try {
      const data = await getExercises({ page: currentPage }); 
      setExercises(data);
      setPaginationData(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const data = await deleteExercises({ id });
        if (data.status === false) {
          Swal.fire('Error!', data.message, 'error');
          return;
        }else{
          fetchExercises(); // Refresh the list after deletion
          Swal.fire('Deleted!', 'The exercise has been deleted.', 'success');
        }
      } catch (error) {
        Swal.fire('Error!', 'Something went wrong while deleting.', 'error');
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchExercises();
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
                  Excercise No
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
                  Chapter
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {exercises?.data.map((exercise, index) => (
                <TableRow key={index}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {exercise.excercise_no}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[40%]">
                    {exercise.title}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {exercise?.chapter?.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {exercise.status ? 'Active' : 'Inactive'} 
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Link className="text-blue-500 hover:text-blue-700" href={`/admin/exercise/update/${exercise.id}`}>Edit</Link>
                      <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(exercise.id)}>Delete</button>
                    </div>
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
