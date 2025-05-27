// /services/excerciseService.ts
import axios from '@/utils/axios';

export const getQuestionTypes = async () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('Token not found in localStorage');
    }
    const { data } = await axios.get("/admin/question-type", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  }
  throw new Error('localStorage is not available on the server side');
};
