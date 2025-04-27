// /services/excerciseService.ts

import axios from '@/utils/axios';

interface ExcerciseParams {
  chapter_id: number;
}

export const getExcercises = async (params: ExcerciseParams) => {

    const { data } = await axios.get("/excercises", {
      params: params, 
    });

    return data;

};

interface GetExcerciseParams {
  slug : string;
}

export const getQuestionsByExcercises = async (params: GetExcerciseParams) => {

    const { data } = await axios.get("/excercises", {
      params: params, 
    });

    return data;

};

