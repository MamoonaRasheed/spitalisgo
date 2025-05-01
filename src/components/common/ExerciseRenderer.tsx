import React from 'react';
import parse from 'html-react-parser';

interface Question {
  description: string;
  options: string[];
}

interface ExerciseRendererProps {
  question_description: string;
  questions: Question[];
}

const ExerciseRenderer = ({ 
  question_description, 
  questions = [] 
}: ExerciseRendererProps) => {
  // Create a safe mapping of question descriptions to options
  const questionOptions = React.useMemo(() => {
    return questions.reduce((acc: Record<string, string[]>, question) => {
      if (question?.description && Array.isArray(question?.options)) {
        acc[question.description] = question.options;
      }
      return acc;
    }, {});
  }, [questions]);

  const replaceDivs = (domNode: any) => {
    if (domNode.name === 'div' && domNode.attribs?.id?.startsWith('q-')) {
      const divId = domNode.attribs.id;
      const options = questionOptions[divId] || [];
      
      return (
        <select 
          id={divId}
          className="german-dropdown"
          defaultValue=""
        >
          <option value="" disabled>-- Bitte wählen --</option>
          {options.map((option, index) => (
            <option key={`${divId}-${index}`} value={option}>
              {option}
            </option>
          ))}
        </select>
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