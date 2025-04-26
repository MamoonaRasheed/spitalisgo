import axios from '@/utils/axios';

export const getAllCategories = async () => {
    const { data } = await axios.get("/categories");

    return data;

};
