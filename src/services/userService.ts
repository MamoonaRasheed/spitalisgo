// \src\services\userService.ts

import axios from '@/utils/axios';

export const getAllUsers = async () => {
  // Check if we're in the browser environment
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error('Token not found in localStorage');
    }

    const { data } = await axios.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } else {
    throw new Error('localStorage is not available on the server side');
  }
};


export const toggleUserStatus = async (id: number, currentStatus: string) => {
  if (typeof window === 'undefined') {
    throw new Error("localStorage is not available on the server side");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found in localStorage");
  }

  try {
    const { data } = await axios.get(`/change-status?id=${id}&currentStatus=${currentStatus}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    console.error("Failed to toggle user status:", error);
    throw error;
  }
};

export const updateUserProfile = async (data: { name: string; email: string; role: string }) => {
  if (typeof window === 'undefined') {
    throw new Error("localStorage is not available on the server side");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found in localStorage");
  }

  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("role", data.role);

    const response = await axios.put("/profile", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
};

export const getCorrectAnswers = async (questionIds: number[]) => {
  if (typeof window === 'undefined') {
    throw new Error("localStorage is not available on the server side");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found in localStorage");
  }

  try {
    const response = await axios.post("/questions/correct-answers", {
      question_ids: questionIds,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch correct answers:", error);
    throw error;
  }
};

interface GetCorrectAnswersParams {
    slug: string;
}

interface GetCorrectAnswersParams {
  slug: string;
}

export const getCorrectAnswersByTask = async ({ slug }: GetCorrectAnswersParams) => {
  try {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error('Token not found in localStorage');
      }

      const { data } = await axios.get(`/show-selected-answers/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } else {
      throw new Error("This function must be run in the browser.");
    }
  } catch (error) {
    console.error('Error checking answers:', error);
    throw error;
  }
};


