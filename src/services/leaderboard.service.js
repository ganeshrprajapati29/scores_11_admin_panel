import axios from "axios";

const API = axios.create({
  baseURL: "/api/v1",
});

export const leaderboardAPI = {

  getAll: (params) => API.get("/leaderboard", { params }),

  getById: (id) => API.get(`/leaderboard/${id}`),

  create: (data) => API.post("/leaderboard", data),

  update: (id, data) => API.put(`/leaderboard/${id}`, data),

  delete: (id) => API.delete(`/leaderboard/${id}`),   // ✅ correct

  getByUser: (userId) => API.get(`/leaderboard/user/${userId}`),

  getByTournament: (tournamentId) => API.get(`/leaderboard/tournament/${tournamentId}`),

};