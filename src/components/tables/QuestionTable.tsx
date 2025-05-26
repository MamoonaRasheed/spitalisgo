'use client'
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getQuestions } from '@/services/admin/questionService';
import Link from "next/link";
import Pagination from "./Pagination";


interface excercise {
  id: number,
  title: string;
}

interface questionType {
  id: number,
  name: string;
}

interface Question {
  id: number,
  description: string;
  excercise: excercise;
  question_type: questionType;
  status: boolean;
}

interface QuestionsResponse {
  data: Question[];
}

interface PaginationResponse {
  current_page: number;
  last_page: number;
  total: number;
}


export default function QuestionTable() {
  const [questions, setQuestions] = useState<QuestionsResponse | null>(null);
  const [paginationData, setPaginationData] = useState<PaginationResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
  const fetchQuestions = async () => {
    try {
      const data = await getQuestions(currentPage);
      console.log(data, "data from api");
      setQuestions(data.data);
      setPaginationData(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  fetchQuestions();
}, [currentPage]); 

  return (
    <div className="flex flex-col gap-4">
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
                    Excercise
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Question Type
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Question
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
                {questions?.data?.map((question, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[20%]">
                      {question.excercise?.title}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[10%]">
                      {question.question_type?.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[50%]">
                      {question.description}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 w-[10%]">
                      {question.status ? 'Active' : 'Inactive'} 
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Link className="text-blue-500 hover:text-blue-700" href={`/admin/questions/update/${question.id}`}>Edit</Link>
                        <button className="text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
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
