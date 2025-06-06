"use client";

import { useEffect, useState } from "react";
import parse from 'html-react-parser';
import { File } from "lucide-react";

interface Question {
  question_id: number;
  description: string;
  options: string[];
  option_q: { id: number; description: string }[];
  showResults: boolean;
}
interface ExerciseRendererProps {
  question_description: string;
  questions: Question[];
  selectedAnswers?: { [questionId: number]: string | number | number[] };
  onAnswerChange?: (questionId: number, selectedOptionId: number, type: string) => void;
  checkResults?: Record<number, { option_id: number; is_correct: boolean }[]>;
  isSubmitted: boolean;
  correctOption?: Record<number, number>;
}

const ExerciseRenderer = ({
  question_description,
  questions = [],
  selectedAnswers = {},
  onAnswerChange,
  checkResults = {},
  isSubmitted = false,
  correctOption = {}
}: ExerciseRendererProps) => {

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const isInsideDropdown = target.closest('.block__select');
    if (!isInsideDropdown) {
      setOpenDropdownId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSubmitted) return;
    const clickedId = (e.currentTarget as HTMLElement).id;
    setOpenDropdownId(prev => (prev === clickedId ? null : clickedId));
  };

  const replaceDivs = (domNode: any) => {
    if (domNode.name === 'span' && domNode.attribs?.id?.startsWith('q-')) {
      const divId = domNode.attribs.id;
      const question = questions.find(q => q.description === divId);
      const option_q = question?.option_q || [];
      const questionId = question?.question_id;
      const selectedOptionId = selectedAnswers?.[questionId || 0];
      const show = question?.showResults;
      let isCorrect = false;
      let correctAnswerText;

      if (typeof questionId === "number") {
        const resultArray = checkResults[questionId];
        const selectedResult = resultArray?.find(r => r.option_id === selectedOptionId);
        isCorrect = selectedResult?.is_correct || false;

        const correctOptionId = resultArray?.find(r => r.is_correct)?.option_id;
        correctAnswerText = correctOption?.[questionId];
      }

      const selectedOptionText = option_q.find(opt => opt.id === selectedOptionId)?.description || '';
      let dropdownClass = "";

      if ((isSubmitted && selectedOptionId) || (show && selectedOptionId)) {
        dropdownClass = isCorrect ? "green-option" : "error";
      }

      return (
        <span
          className={`block__select left ${openDropdownId === divId ? "open" : ""}`}
          id={divId}
          onClick={toggleDropdown}
        >
          <span className={`span-select ${dropdownClass} relative group`}>
            <span className="num">{selectedOptionText}</span>

            {/* Tooltip */}
            {isSubmitted && selectedOptionId && !isCorrect && correctAnswerText && (
              <>
                <span className="absolute -top-2 -right-3 text-red-600 text-sm">
                  <File className="w-4 h-4" />
                </span>                
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-white text-sm text-green-700 border border-green-500 px-2 py-1 rounded shadow whitespace-nowrap z-50">
                  ✅ Correct: {correctAnswerText}
                </span>
              </>
            )}

            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.3307 13.3333L15.9974 18.6666L10.6641 13.3333"
                stroke="#161616"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          {openDropdownId === divId && (
            <span className="ul z-30">
              {option_q.map((option) => (
                <span
                  key={`${divId}-${option.id}`}
                  data-num={`${divId}-${option.id}`}
                  className="li"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isSubmitted) return;
                    if (questionId != null) {
                      onAnswerChange?.(questionId, option.id, 'dropdown');
                    }
                    setOpenDropdownId(null);
                  }}
                >
                  {option.description}
                </span>
              ))}
            </span>
          )}
        </span>
      );
    }
    return undefined;
  };

  if (!question_description) {
    return <div className="text-gray-500">No question content available</div>;
  }

  try {
    return (
      <div className="german-exercise-container">
        {parse(question_description, { replace: replaceDivs })}
      </div>
    );
  } catch (error) {
    console.error('Error parsing question:', error);
    return <div className="text-red-500">Error displaying question</div>;
  }
};

export default ExerciseRenderer;
