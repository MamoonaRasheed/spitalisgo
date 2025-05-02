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
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, string>>({});

  const questionOptions = React.useMemo(() => {
    return questions.reduce((acc: Record<string, string[]>, question) => {
      if (question?.description && Array.isArray(question?.options)) {
        acc[question.description] = question.options;
      }
      return acc;
    }, {});
  }, [questions]);

  const correctAnswers = React.useMemo(() => {
    return questions.reduce((acc: Record<string, string>, question) => {
      acc[question.description] = question.correct_option;
      return acc;
    }, {});
  }, [questions]);

  const isAllCorrect = React.useMemo(() => {
    return Object.keys(correctAnswers).length > 0 &&
      Object.entries(correctAnswers).every(([key, correct]) => selectedAnswers[key] === correct);
  }, [selectedAnswers, correctAnswers]);

  const getBorderClass = (id: string) => {
    const selected = selectedAnswers[id];
    if (!selected) return '';
    return selected === correctAnswers[id] ? 'border-green-500' : 'border-red-500';
  };


  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setSelectedAnswers(prev => ({ ...prev, [id]: value }));
  };

  const replaceDivs = (domNode: any) => {
    if (domNode.name === 'div' && domNode.attribs?.id?.startsWith('q-')) {
      const divId = domNode.attribs.id;
      const options = questionOptions[divId] || [];
      const borderClass = getBorderClass(divId);

      return (
        <select
          id={divId}
          className={`german-dropdown border-2 ${getBorderClass(divId)}`}
          value={selectedAnswers[divId] || ''}
          onChange={handleSelectChange}
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

  return (
    <div className="german-exercise-container space-y-4">
      {parse(question_description, { replace: replaceDivs })}
      {/* Optional Feedback Message */}
      {Object.keys(selectedAnswers).length === questions.length && (
        <div className={`font-semibold ${isAllCorrect ? 'text-green-600' : 'text-red-600'}`}>
          {isAllCorrect ? 'Alle Antworten sind korrekt!' : 'Einige Antworten sind falsch.'}
        </div>
      )}
    </div>
  );
};


export default ExerciseRenderer;