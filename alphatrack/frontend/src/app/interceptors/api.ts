import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // handle expired token if needed
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // try to refresh token here
      return Promise.reject(error); // Let hook handle redirect
    }

    return Promise.reject(error);
  }
);

export default api;
