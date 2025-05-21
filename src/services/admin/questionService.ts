// /services/excerciseService.ts
import axios from '@/utils/axios';

interface Question {
  description: string;
  options: string[];
  question_type_id: number;
  correctOption: number | string;
}

interface QuestionData {
  excercise_id: number | null;
  questions: Question[];
  description: string;
  status: boolean;
}
interface UpdateQuestionPayload {
  exercise_id: number;
  description: string;
  status: boolean;
  excercise_type: string;
  questions: {
    id?: number; // Optional: in case you're updating existing questions
    description: string;
    options: (string | { id?: number; description: string })[];
    question_type_id: number;
    correctOption: number | string;
  }[];
}

export const getQuestions = async () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('Token not found in localStorage');
    }
    
    const { data } = await axios.get("/admin/questions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  }
  throw new Error('localStorage is not available on the server side');
};

export const createQuestion = async (questionData: QuestionData) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('Token not found in localStorage');
    }

    // Prepare the data according to backend requirements
    const payload = {
      excercise_id: questionData.excercise_id,
      questions: questionData.questions.map((question) => ({
        description: question.description,
        options: question.options,
        question_type_id: question.question_type_id ?? 0,
        correctOption: question.correctOption 
      })),
      description: questionData.description,
      status: questionData.status
    };

    const { data } = await axios.post("/admin/questions", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('data', data)

    return data;
  }
  throw new Error('localStorage is not available on the server side');
};


export const getQuestion = async (id: number) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('Token not found in localStorage');
    }
    const { data } = await axios.get(`/admin/questions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  }
  throw new Error('localStorage is not available on the server side');
}

export const updateQuestion = async (
  questionId: number,
  payload: UpdateQuestionPayload
) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found in localStorage');
    }

    const { data } = await axios.patch(`/admin/questions/${questionId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return data;
  }
  throw new Error('localStorage is not available on the server side');
};