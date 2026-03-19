import axios from "axios";

const BASE_URL = "http://localhost:3000/api/v1";

/* AXIOS INSTANCE */

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

/* REQUEST INTERCEPTOR */

API.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

  },
  (error) => {
    return Promise.reject(error);
  }
);

/* RESPONSE INTERCEPTOR */

API.interceptors.response.use(
  (response) => response,
  (error) => {

    console.error("API Error:", error?.response || error);

    return Promise.reject(
      error?.response?.data || error.message
    );

  }
);

/* PLAYER PROFILE API */

export const playerProfilesAPI = {

  /* GET ALL PROFILES */
  getAll: (params = {}) =>
    API.get("/profiles", { params }),

  /* GET PROFILE BY ID */
  getById: (id) =>
    API.get(`/profiles/${id}`),

  /* CREATE PROFILE */
  create: (data) =>
    API.post("/profiles", data),

  /* UPDATE PROFILE */
  update: (id, data) =>
    API.put(`/profiles/${id}`, data),

  /* DELETE PROFILE */
  delete: (id) =>
    API.delete(`/profiles/${id}`)

};

export default API;