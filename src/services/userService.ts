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

  const endpoint =
    currentStatus === "active"
      ? `/users/${id}/status/inactive`
      : `/users/${id}/status/active`;

  try {
    const { data } = await axios.patch(endpoint, {}, {
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

export const updateUserProfile = async (formData: FormData) => {
  if (typeof window === 'undefined') {
    throw new Error("localStorage is not available on the server side");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found in localStorage");
  }

  try {
    const { data } = await axios.put("/profile", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
};