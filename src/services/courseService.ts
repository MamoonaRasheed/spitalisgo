import axios from '@/utils/axios';

export const getAllCourses = async () => {

    const { data } = await axios.get("/courses");

    return data;
};
