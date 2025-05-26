// /services/excerciseService.ts
import axios from '@/utils/axios';

interface ExerciseParams {
  chapter_id?: number;
  page?: number;
}

interface ExerciseData {
  excercise_type_id: number;
  chapter_id: number;
  exercise_no: string;
  title: string;
  description?: string;
  sort?: number;
  status?: boolean;
}
export const getExercises = async (params?: ExerciseParams) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('Token not found in localStorage');
    }

    const queryParams: any = {};
    if (params?.chapter_id) {
      queryParams.chapter_id = params.chapter_id;
    }
    if (params?.page) {
      queryParams.page = params.page;
    }

    const { data } = await axios.get("/admin/excercises", {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  }

  throw new Error('localStorage is not available on the server side');
};

export const getExerciseTypes = async () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('Token not found in localStorage');
    }
    const { data } = await axios.get("/exercise-types", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  }
  throw new Error('localStorage is not available on the server side');
};

export const createExercise = async (exerciseData: ExerciseData) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('Token not found in localStorage');
    }

    // Prepare the data according to backend requirements
    const payload = {
      excercise_type_id: exerciseData.excercise_type_id,
      chapter_id: exerciseData.chapter_id,
      exercise_no: exerciseData.exercise_no,
      title: exerciseData.title,
      description: exerciseData.description || null,
      sort: exerciseData.sort || 0,
      status: exerciseData.status ?? true // Default to true if not provided
    };

    const { data } = await axios.post("/excercises", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return data;
  }
  throw new Error('localStorage is not available on the server side');
};

export const getExercise = async (id: number) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('Token not found in localStorage');
    }
    const { data } = await axios.get(`/admin/excercises/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  }
  throw new Error('localStorage is not available on the server side');
}

export const updateExercise = async (id: number, exerciseData: ExerciseData) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('Token not found in localStorage');
    }

    // Prepare the data according to backend requirements
    const payload = {
      excercise_type_id: exerciseData.excercise_type_id,
      chapter_id: exerciseData.chapter_id,
      exercise_no: exerciseData.exercise_no,
      title: exerciseData.title,
      description: exerciseData.description || null,
      sort: exerciseData.sort || 0,
      status: exerciseData.status ?? true // Default to true if not provided
    };

    const { data } = await axios.patch(`/excercises/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return data;
  }
  throw new Error('localStorage is not available on the server side');
}

export const getExerciseOption = async () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error('Token not found in localStorage');
    }
    const { data } = await axios.get("/admin/exercise-option", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  }
  throw new Error('localStorage is not available on the server side');
};