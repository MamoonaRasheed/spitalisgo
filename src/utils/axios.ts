import axios from 'axios';

const instance = axios.create({
  baseURL: "/api", // So axios.post("/login") becomes /api/login
  headers: {
    Accept: "application/json",
  },
});

export default instance;