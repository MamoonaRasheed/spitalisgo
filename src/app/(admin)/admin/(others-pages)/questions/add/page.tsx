"use client";
import React, { useEffect, useState } from "react";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";
import Input from '@/components/form/input/InputField';
import Radio from "@/components/form/input/Radio";
import { getQuestionTypes } from '@/services/admin/questionTypeService';
import { getExerciseOption, getExerciseTypes } from '@/services/admin/excerciseService';
import { createQuestion } from '@/services/admin/questionService';
import $ from 'jquery';
import 'summernote/dist/summernote-lite.css';
import 'summernote/dist/summernote-lite.js';
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import { stringify } from "querystring";

interface QuestionType {
  id: number;
  name: string;
}

interface Exercise {
  id: number;
  title: string;
  chapter: string;
  excercise_type: string;
  exercise_no: string;
}

interface Question {
  description: string;
  options: string[];
  question_type_id?: number | null;
  correctOption: number | string;
}

interface FormData {
  exercise_id: number | null;
  questions: Question[];
  excercise_type: string;
  description: string;
  status: boolean;
}

export default function AddExercise() {
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
  const [exerciseOption, setExerciseOption] = useState<Exercise[]>([]);
  const [formData, setFormData] = useState<FormData>({
    exercise_id: null,
    questions: [
      {
        description: '',
        options: [],
        question_type_id: null,
        correctOption: 0,
      }
    ],
    description: '',
    status: true,
    excercise_type: ''
  });

  const router = useRouter();
  
  // Initialize Summernote
  useEffect(() => {
    const summernote = ($('#summernote') as any).summernote({
      placeholder: 'Write exercise description...',
      height: 200,
      toolbar: [
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['font', ['strikethrough', 'superscript', 'subscript']],
        ['insert', ['link', 'picture', 'video']],
        ['view', ['codeview', 'help']]
      ],
      callbacks: {
        onChange: (content: string) => {
          setFormData(prev => ({ ...prev, description: content }));
        }
      }
    });

    return () => summernote.summernote('destroy');
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [questionTypesData, exerciseOptionData] = await Promise.all([
            getQuestionTypes(),
            getExerciseOption(),
        ]);

        if (questionTypesData.status) {
          setQuestionTypes(questionTypesData.data.map((type: any) => ({
            id: type.id,
            name: type.name
          })));
        }

        if (exerciseOptionData.status) {
          console.log('Exercise options:', exerciseOptionData.data);
          setExerciseOption(exerciseOptionData.data.map((exerciseOption: any) => ({
            id: exerciseOption.id,
            title: exerciseOption.title,
            chapter: exerciseOption.chapter,
            excercise_type: exerciseOption.excercise_type
          })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addQuestion = () => {
    const hasEmptyDescription = formData.questions.some(
      question => question.description.trim() === ''
    );
  
    if (hasEmptyDescription) {
      toast.error('Please fill all question descriptions before adding a new one.');
      return;
    }
    
    setFormData(prevFormData => ({
      ...prevFormData,
      questions: [
        ...prevFormData.questions,
        {
          description: '',
          options: [],
          question_type_id: null,
          correctOption: 0,
        }
      ]
    }));
  };

  const removeQuestion = (index: number) => {
    if (formData.questions.length === 1) return;
    setFormData(prevFormData => ({
      ...prevFormData,
      questions: prevFormData.questions.filter((_, i) => i !== index)
    }));
  };

  // Add Option to specific question
  const addOption = (qIndex: number) => {
    const currentOptions = formData.questions[qIndex].options;

    const hasEmpty = currentOptions.some(opt => opt.trim() === '');
    if (hasEmpty) {
      toast.error('Please fill all existing options before adding a new one.');
      return;
    }

    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options.push('');
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Remove Option from specific question
  const removeOption = (qIndex: number, optIndex: number) => {
    const updatedQuestions = [...formData.questions];
    if (updatedQuestions[qIndex].options.length === 1) return;
    updatedQuestions[qIndex].options.splice(optIndex, 1);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Update Option Value
  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleSelectChange = (name: string, value: string) => {
    if(name === 'exercise_id') {
      const exercise = exerciseOption.find(ex => ex.id === Number(value));
      console.log('Selected exercise:', exercise);
      if (exercise) {
        setFormData(prev => ({ ...prev, ['excercise_type']: exercise.excercise_type }));
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };
  
  const handleQuestionTypeChange = (qIndex: number, value: string) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].question_type_id = Number(value);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const updateCorrectOption = (qIndex: number, optIndex: number) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].correctOption = optIndex;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const updateCorrectOptionForInputField = (qIndex: number, optValue: string) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[qIndex].correctOption = optValue;
    setFormData({ ...formData, questions: updatedQuestions });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', JSON.stringify(formData));
    
    if (!formData.exercise_id) {
        toast.error('Please select an exercise');
        return;
    }
    
    // Check if all questions have a question type
    const hasEmptyQuestionType = formData.questions.some(
      question => !question.question_type_id
    );
    
    if (hasEmptyQuestionType) {
      toast.error('Please select a question type for all questions');
      return;
    }
    // return;
    try {
        const response = await createQuestion({
            ...formData,
            excercise_id: formData.exercise_id as number,
            questions: formData.questions.map(question => ({
                description: question.description,
                options: question.options,
                question_type_id: question.question_type_id ?? 0,
                correctOption: question.correctOption // Default to 0 if null or undefined
            }))
        });
        
        console.log('Questions created:', response);
        
        if(response.status === false) {
          toast.error(response.message);
          return;
        } else {
            toast.success('Questions created successfully');
            router.push("/admin/questions");
        }
    } catch (error) {
        console.error('Error creating questions:', error);
        toast.error('Failed to create questions');
    }
  };

  // Convert data to Select options format
  const questionTypeOptions = questionTypes.map(type => ({
    value: type.id,
    label: type.name
  }));

  const exerciseOptionsData = exerciseOption.map(exercise => ({
    value: exercise.id,
    label: exercise.title
  }));

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Add Question
        </h3>

        {/* Required Fields */}
        <div className="flex gap-10 mx-9 mb-8">
          <div className="flex-1">
            <Label>Exercise*</Label>
            <div className="relative">
              <Select
                options={exerciseOptionsData}
                placeholder="Select Exercise"
                className="dark:bg-dark-900"
                value={formData.exercise_id}
                onChange={(value: string) => handleSelectChange('exercise_id', value)}
                required={true}
              />
              <ChevronDownIcon className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400" />
            </div>
          </div>

          <div className="flex-1">
            <Label>Exercise Type*</Label>
            <div className="relative">
              <Input
                type="text"
                name="title"
                placeholder="Exercise Type"
                value={formData.excercise_type}
                disabled={true}
              />
            </div>
          </div>
        </div>

        <div className="mx-9 mb-8">
          <Label>Question Description*</Label>
          {formData.questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-4 border p-4 rounded">
              {/* Question Type dropdown moved inside each question card */}
              <div className="mb-3">
                <Label>Question Type*</Label>
                <div className="relative mb-3">
                  <Select
                    options={questionTypeOptions}
                    placeholder="Select Question Type"
                    className="dark:bg-dark-900"
                    value={question.question_type_id}
                    onChange={(value: string) => handleQuestionTypeChange(qIndex, value)}
                    required={true}
                  />
                  <ChevronDownIcon className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400" />
                </div>
              </div>
              

              {(question.question_type_id === 1 || question.question_type_id === 2)  && (
                <div className="mb-3">
                  <label className="text-gray-700">Question Title</label>
                  <div className="flex items-center mb-3">
                    <input
                      type="text"
                      placeholder={`Question ${qIndex + 1}`}
                      value={question.description}
                      onChange={(e) => {
                        const updatedQuestions = [...formData.questions];
                        updatedQuestions[qIndex].description = e.target.value;
                        setFormData({ ...formData, questions: updatedQuestions });
                      }}
                      className="border p-2 rounded w-full mr-2"
                    />
                    {formData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      > - </button>
                    )}
                  </div>
                
                  <div className="mt-3 ml-4">
                    <Label>Options</Label>
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                          placeholder={`Option ${optIndex + 1}`}
                          className="border p-2 rounded w-full"
                        />

                        {/* Correct option radio button */}
                        <input
                          type="radio"
                          name={`correctOption-${qIndex}`}
                          checked={question.correctOption === optIndex}
                          onChange={() => updateCorrectOption(qIndex, optIndex)}
                          className="accent-green-600"
                          title="Mark as Correct"
                        />

                        {question.options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOption(qIndex, optIndex)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          > - </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mt-2"
                    >
                      Add Option
                    </button>
                  </div>
                </div>
              ) }
              {(question.question_type_id === 3)  && (
                <div className="mb-3">
                  <label className="text-gray-700">Question Title</label>
                  <div className="flex items-center mb-3">
                    <input
                      type="text"
                      placeholder={`Question ${qIndex + 1}`}
                      value={question.description}
                      onChange={(e) => {
                        const updatedQuestions = [...formData.questions];
                        updatedQuestions[qIndex].description = e.target.value;
                        setFormData({ ...formData, questions: updatedQuestions });
                      }}
                      className="border p-2 rounded w-full mr-2"
                    />
                    {formData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      > - </button>
                    )}
                  </div>

                  <div className="mt-3 ml-4">
                    <Label>Answer</Label>
                    <input
                          type="text"
                          name={`correctOption-${qIndex}`}
                          value={question.correctOption}
                          onChange={(e) => updateCorrectOptionForInputField(qIndex, e.target.value)}
                          placeholder={`Answer`}
                          className="border p-2 rounded w-[40%] mr-2"
                        />
                  </div>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Question
          </button>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/questions")}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2"
          >
            Back
          </button>
        </div>
      </div>
    </form>
  );
}