import axios from "axios";

const BASE_URL = "http://localhost:3000/api/v1";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const playerService = {

  // Get all players
  getAll: async () => {
    const res = await axios.get(`${BASE_URL}/players`, getAuthHeader());
    return res.data;
  },

  // Get player by ID
  getById: async (id) => {
    const res = await axios.get(`${BASE_URL}/players/${id}`, getAuthHeader());
    return res.data;
  },

  // Create player
  create: async (data) => {
    const res = await axios.post(`${BASE_URL}/players`, data, getAuthHeader());
    return res.data;
  },

  // Update player
  update: async (id, data) => {
    const res = await axios.put(`${BASE_URL}/players/${id}`, data, getAuthHeader());
    return res.data;
  },

  // Delete player
  delete: async (id) => {
    const res = await axios.delete(`${BASE_URL}/players/${id}`, getAuthHeader());
    return res.data;
  }

};