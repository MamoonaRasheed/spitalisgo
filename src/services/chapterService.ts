// /services/chapterService.ts

import axios from '@/utils/axios';

interface ChapterParams {
  exam: string;
  course: string;
  category: string;
}

export const getChapters = async (params: ChapterParams) => {
    const { data } = await axios.get("/chapters", {
      params: params, 
    });

    return data;

};
