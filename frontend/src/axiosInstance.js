import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 500,
});

axiosInstance.interceptors.request.use(function (config) {
  return {
    ...config,
    headers: {
      "x-auth-token": localStorage.getItem("TOKEN"),
    },
  };
});

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (ex) {
    if (ex?.response?.status === 401) {
      localStorage.clear();
      return window.location.replace("/auth/login");
    }

    alert(ex?.response?.data?.message || "Something went Wrong");
  }
);
