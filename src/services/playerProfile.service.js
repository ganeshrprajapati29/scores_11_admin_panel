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
  getAll: async (params = {}) => {
    const res = await API.get("/profiles", { params });
    return res.data;   // ✅ always return data only
  },

  /* GET PROFILE BY ID */
  getById: async (id) => {
    if (!id) throw new Error("Profile ID is required");

    const res = await API.get(`/profiles/${id}`);
    return res.data;
  },

  /* CREATE PROFILE */
  create: async (data) => {
    if (!data) throw new Error("Profile data is required");

    const res = await API.post("/profiles", data);
    return res.data;
  },

  /* UPDATE PROFILE */
  update: async (id, data) => {
    if (!id) throw new Error("Profile ID is required");

    const res = await API.put(`/profiles/${id}`, data);
    return res.data;
  },

  /* DELETE PROFILE */
  delete: async (id) => {
    if (!id) throw new Error("Profile ID is required");

    const res = await API.delete(`/profiles/${id}`);
    return res.data;
  }

};
export default API;