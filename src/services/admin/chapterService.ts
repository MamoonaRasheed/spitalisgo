import axios from '@/utils/axios';

interface ChapterParams {
  exam?: string;
  course?: string;
  category?: string;
  page?: number;
}

export const getChapters = async (params?: ChapterParams) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('Token not found in localStorage');
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: params || {},
    };

    const { data } = await axios.get("/admin/chapters", config);
    
    return data;
  }
};