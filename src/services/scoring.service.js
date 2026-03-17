import api from '../config/axiosConfig.js';

export const scoringService = {
  initializeMatch: async (matchId, data) => {
    const response = await api.post(`/scoring/match/${matchId}/initialize`, data);
    return response.data;
  },

  addBall: async (matchId, data) => {
    const response = await api.post(`/scoring/match/${matchId}/ball`, data);
    return response.data;
  },

  getMatchScoring: async (matchId) => {
    const response = await api.get(`/scoring/match/${matchId}/scoring`);
    return response.data;
  },

  getLiveScore: async (matchId) => {
    const response = await api.get(`/scoring/match/${matchId}/live`);
    return response.data;
  },

  getFullScorecard: async (matchId) => {
    const response = await api.get(`/scoring/match/${matchId}/scorecard`);
    return response.data;
  },

  startInnings: async (matchId, inningsNumber) => {
    const response = await api.post(`/scoring/match/${matchId}/innings/start`, { inningsNumber });
    return response.data;
  },

  endInnings: async (matchId) => {
    const response = await api.post(`/scoring/match/${matchId}/innings/end`);
    return response.data;
  },

  setStriker: async (matchId, batsmanId) => {
    const response = await api.patch(`/scoring/match/${matchId}/striker`, { batsmanId });
    return response.data;
  },

  setNonStriker: async (matchId, batsmanId) => {
    const response = await api.patch(`/scoring/match/${matchId}/non-striker`, { batsmanId });
    return response.data;
  },

  setBowler: async (matchId, bowlerId) => {
    const response = await api.patch(`/scoring/match/${matchId}/bowler`, { bowlerId });
    return response.data;
  },

  getPartnership: async (matchId) => {
    const response = await api.get(`/scoring/match/${matchId}/partnership`);
    return response.data;
  },

  getFallOfWickets: async (matchId) => {
    const response = await api.get(`/scoring/match/${matchId}/fall-of-wickets`);
    return response.data;
  },

  updateResult: async (matchId, data) => {
    const response = await api.patch(`/scoring/match/${matchId}/result`, data);
    return response.data;
  },

  getOverSummary: async (matchId, overNumber) => {
    const response = await api.get(`/scoring/match/${matchId}/over/${overNumber}`);
    return response.data;
  },

  getMatchTimeline: async (matchId) => {
    const response = await api.get(`/scoring/match/${matchId}/timeline`);
    return response.data;
  }
};

export default scoringService;

