"use client";
import React, { useEffect, useState, use } from "react";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";
import Input from '@/components/form/input/InputField';
import RadioButtons from "@/components/form/form-elements/RadioButtons";
import { getExerciseTypes, updateExercise, getExercise } from '@/services/excerciseService';
import { getChapters } from '@/services/chapterService';
import $ from 'jquery';
import 'summernote/dist/summernote-lite.css';
import 'summernote/dist/summernote-lite.js';
import { toast } from 'react-toastify';
import { useRouter, notFound } from "next/navigation";
import LoadingSpinner from "@/components/loader/Loader";
interface ExerciseType {
  id: number;
  name: string;
}

interface Chapter {
  id: number;
  title: string;
}

interface FormData {
  excercise_type_id: number | null;
  chapter_id: number | null;
  exercise_no: string;
  title: string;
  description: string;
  sort: number;
  status: boolean;
}

export default function UpdateExercise({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const exerciseId = parseInt(id);
  
  const [excerciseTypes, setExcerciseTypes] = useState<ExerciseType[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [formData, setFormData] = useState<FormData>({
    excercise_type_id: null,
    chapter_id: null,
    exercise_no: '',
    title: '',
    description: '',
    sort: 0,
    status: true
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
// Fetch exercise data and initialize form
useEffect(() => {
  const fetchExerciseData = async () => {
    try {
      if (isNaN(exerciseId)) {
        notFound();
        return;
      }

      // Fetch exercise data
      const exercise = await getExercise(exerciseId);
      console.log('Exercise data:', exercise);
      if (exercise.status) {
        // Initialize form with exercise data
        setFormData({
          excercise_type_id: exercise?.data?.excercise_type_id,
          chapter_id: exercise?.data?.chapter_id,
          exercise_no: exercise?.data?.excercise_no,
          title: exercise?.data?.title,
          description: exercise?.data?.description,
          sort: exercise?.data?.sort,
          status: exercise?.data?.status
        });

        // Initialize Summernote with the exercise description
        ($('#summernote') as any).summernote('code', exercise?.data?.description);
      }else{
        notFound();
        return;
      }

      // Fetch dropdown options
      const [typesData, chaptersData] = await Promise.all([
        getExerciseTypes(),
        getChapters()
      ]);

      // Set dropdown options
      if (typesData.status) {
        setExcerciseTypes(typesData.data.map((type: any) => ({
          id: type.id,
          name: type.name
        })));
      }

      if (chaptersData.status) {
        setChapters(chaptersData.data.map((chapter: any) => ({
          id: chapter.id,
          title: chapter.chapter
        })));
      }

      

    } catch (error) {
      console.error('Error fetching data:', error);
      notFound();
    } finally {
      setIsLoading(false);
    }
  };

  fetchExerciseData();
}, [exerciseId]);

  // Initialize Summernote
  useEffect(() => {
    const summernote = ($('#summernote') as any).summernote({
      placeholder: 'Write exercise description...',
      height: 200,
      toolbar: [
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['view', ['codeview']]
      ],
      callbacks: {
        onChange: (content: string) => {
          setFormData(prev => ({ ...prev, description: content }));
        }
      }
    });

    return () => summernote.summernote('destroy');
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSelectChange = (
    name: keyof Pick<FormData, 'chapter_id' | 'excercise_type_id'>,
    value: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [name]: value ? null : Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    if (!formData.excercise_type_id || !formData.chapter_id || !formData.title || !formData.exercise_no) {
        toast.error('Please fill all required fields');
        return;
    }
    try {
        const response = await updateExercise(exerciseId, {
            ...formData,
            excercise_type_id: formData.excercise_type_id as number,
            chapter_id: formData.chapter_id as number
          });
        console.log('Exercise created:', response);
        if(response.status === false) {
          toast.error(response.message);
          return;

        }else{
            toast.success('Exercise created successfully');
            router.push("/admin/exercise");
        }
      } catch (error) {
        console.error('Error creating exercise:', error);
      }
  };

  const exerciseTypeOptions = excerciseTypes.map(type => ({
    value: type.id,
    label: type.name
  }));

  const chapterOptions = chapters.map(chapter => ({
    value: chapter.id,
    label: chapter.title
  }));



  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Update Exercise
        </h3>
       
        {/* Required Fields */}
        <div className="flex gap-20 mx-9 mb-8">
          <div className="flex-1">
            <Label>Exercise Type*</Label>
            <div className="relative">
              <Select
                options={exerciseTypeOptions}
                placeholder="Select Exercise Type"
                onChange={(value: number) => handleSelectChange('excercise_type_id', value)}
                className="dark:bg-dark-900"
                value={formData.excercise_type_id}
                required
              />
              <ChevronDownIcon className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400" />
            </div>
          </div>

          <div className="flex-1">
            <Label>Chapter*</Label>
            <div className="relative">
            <Select
              options={chapterOptions}
              placeholder="Select Chapter"
              onChange={(value: number) => handleSelectChange('chapter_id', value)}
              value={formData.chapter_id}
              required
            />
              <ChevronDownIcon className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400" />
            </div>
          </div>
        </div>
        
        <div className="flex gap-10 mx-9 mb-8">
          <div className="flex-1">
            <Label>Exercise Number*</Label>
            <Input
              type="text"
              name="exercise_no"
              placeholder="e.g., EX-001"
              value={formData.exercise_no}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex-1">
            <Label>Sort Order</Label>
            <Input
              type="number"
              name="sort"
              placeholder="Order number"
              value={formData.sort}
              onChange={handleNumberInputChange}
            />
          </div>
        </div>

        <div className="flex gap-10 mx-9 mb-8">
          <div className="flex-1">
            <Label>Title*</Label>
            <Input
              type="text"
              name="title"
              placeholder="Exercise title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="flex gap-10 mx-9 mb-8">
          <div className="flex-1">
            <Label>Description</Label>
            <textarea id="summernote"></textarea>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/exercise")}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-white-700 focus:outline-none focus:ring-2"
          >
            Back
          </button>          
        </div>
      </div>
    </form>
  );
}