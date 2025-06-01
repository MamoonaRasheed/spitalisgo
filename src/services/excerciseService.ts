// /services/excerciseService.ts

import axios from '@/utils/axios';
interface ExcerciseParams {
  chapter_id: number;
}

export const getExcercises = async (params: ExcerciseParams) => {
  const token = localStorage.getItem("token");

  const { data } = await axios.get("/excercises", {
    params,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  console.log("data recieved in exercise service----------==----",data)
  return data;
};

interface GetExcerciseParams {
  slug: string;
}

export const getQuestionsByExcercises = async (params: GetExcerciseParams) => {

  const { data } = await axios.get("/excercises", {
    params: params,
  });

  return data;

};
interface SelectedAnswers {
  [questionId: string]: string | number | number[];
}

interface SubmitAnswersPayload {
  exerciseId: number | string;
  answers: SelectedAnswers;
}

export const submitAnswers = async ({ exerciseId, answers }: SubmitAnswersPayload) => {
  if (typeof window === 'undefined') {
    throw new Error("localStorage is not available on the server side");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found in localStorage");
  }

  try {
    const payload = {
      exercise_id: exerciseId,
      answers: Object.entries(answers).map(([questionId, optionId]) => ({
        question_id: parseInt(questionId),
        option_id: optionId,
      })),
    };

    console.log("Payload for submitting answer09999999999999999999909090909", payload);

    const response = await axios.post("/store-answers", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;

  } catch (error: any) {
    console.error('Error submitting answers:', error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || 'Failed to submit answers');
  }
};


