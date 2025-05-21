import axios from '@/utils/axios';
interface GetTaskParams {
    slug: string;
}

export const getQuestionByTask = async ({ slug }: GetTaskParams) => {
    try {
        const { data } = await axios.get(`/tasks/${slug}`);
        return data;
    } catch (error) {
        console.error('Error checking answers:', error);
        throw error;
    }
};

