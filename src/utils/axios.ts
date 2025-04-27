import axios from 'axios';

const instance = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
  },
});

export default instance;