
import axios from '@/utils/axios';

export const checkQuestionAnswers = async (payload: any) => {
  console.log('here i am in service');
  if (typeof window === 'undefined') {
    throw new Error("localStorage is not available on the server side");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found in localStorage");
  }
  console.log(payload, "payloadservice");
  try {
    const response = await axios.post("/correct-answers", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response, "responseservice");
    return response.data;
  } catch (error) {
    console.error('Error checking answers:', error);
    throw error;
  }
};



export const getResult = async (payload: any) => {
  console.log('here i am in service');
  if (typeof window === 'undefined') {
    throw new Error("localStorage is not available on the server side");
  }
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found in localStorage");
  }
  try {
    const response = await axios.post("/get-result", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response, "responseservice");
    return response.data;
  } catch (error) {
    console.error('Error checking answers:', error);
    throw error;
  }
};

export const showResult = async () => {
  if (typeof window === 'undefined') {
    throw new Error("localStorage is not available on the server side");
  }
  
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("Token not found in localStorage");
  }

  const { data } = await axios.get("/show-results", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;

};
