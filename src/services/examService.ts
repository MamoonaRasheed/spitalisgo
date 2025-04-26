import axios from '@/utils/axios';

export const getAllExams = async () => {

    const { data } = await axios.get("/exams");

    return data;

};
