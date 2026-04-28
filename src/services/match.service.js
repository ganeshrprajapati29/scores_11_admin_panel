import api from '../config/axiosConfig'

const matchesAPI = {

  // 🔥 GET ALL MATCHES
  getAllMatches: async (params = {}) => {
    try {
      const res = await api.get('/matches/list', { params })

      let data = res.data || []

      // ✅ IMPORTANT: NO FILTER → ALL MATCHES
      if (Array.isArray(data)) {
        return data
      }

      if (Array.isArray(data?.matches)) {
        return data.matches
      }

      return []

    } catch (error) {
      console.error("getAllMatches error:", error)
      throw error
    }
  },

  // 🔥 GET MATCH BY ID
  getById: async (id) => {
    try {
      const res = await api.get(`/matches/${id}`)
      return res.data
    } catch (error) {
      console.error("getById error:", error)
      throw error
    }
  },

  // 🔥 CREATE MATCH
  createMatch: async (data) => {
    try {
      const res = await api.post('/matches', data)
      return res.data
    } catch (error) {
      console.error("createMatch error:", error)
      throw error
    }
  },

  // 🔥 UPDATE MATCH
  updateMatch: async (id, data) => {
    try {
      const res = await api.put(`/matches/${id}`, data)
      return res.data
    } catch (error) {
      console.error("updateMatch error:", error)
      throw error
    }
  },

  // 🔥 DELETE MATCH
  deleteMatch: async (id) => {
    try {
      const res = await api.delete(`/matches/${id}`)
      return res.data
    } catch (error) {
      console.error("deleteMatch error:", error)
      throw error
    }
  },

  // 🔥 START MATCH
  startMatch: async (id) => {
    try {
      const res = await api.patch(`/matches/${id}/start`)
      return res.data
    } catch (error) {
      console.error("startMatch error:", error)
      throw error
    }
  },

  // 🔥 END MATCH
  endMatch: async (id) => {
    try {
      const res = await api.patch(`/matches/${id}/end`)
      return res.data
    } catch (error) {
      console.error("endMatch error:", error)
      throw error
    }
  },

  // 🔥 UPDATE STATUS
  updateStatus: async (id, status) => {
    try {
      const res = await api.patch(`/matches/${id}/status`, { status })
      return res.data
    } catch (error) {
      console.error("updateStatus error:", error)
      throw error
    }
  },

  // 🔥 LIVE MATCHES (🔥 FIXED SAFE VERSION)
  getLiveMatches: async () => {
    try {
      const res = await api.get('/matches/live')

      // ✅ handle both types of backend response
      if (Array.isArray(res.data)) {
        return res.data
      } else if (res.data?.data) {
        return res.data.data
      } else {
        return []
      }

    } catch (error) {
      console.error("getLiveMatches error:", error)
      return [] // ✅ crash nahi hoga
    }
  },




  updateScore: async (id, data) => {
    try {
      const res = await api.patch(`/matches/${id}/score`, data)
      return res.data
    } catch (error) {
      console.error("updateScore error:", error)
      throw error
    }
  },
 
  changeInnings: async (id, innings) => {
    try {
      const res = await api.patch(`/matches/${id}/innings`, { innings })
      return res.data
    } catch (error) {
      console.error("changeInnings error:", error)
      throw error
    }
  },




 endInnings: async (matchId) => {
  try {
    // ✅ Validate input
    if (!matchId) {
      throw new Error("Match ID is required");
    }

    console.log("🚀 API Call: End Innings →", matchId);

    // ✅ API request
    const res = await api.patch(`/matches/${matchId}/end-innings`)

    // ✅ Extract clean response
    const data = res?.data?.data || res?.data || null;

    if (!data) {
      throw new Error("Invalid response from server");
    }

    console.log("✅ API Success: End Innings", data);

    return data;

  } catch (error) {
    // ✅ Clean error extraction
    const errorMsg =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "Failed to end innings";

    console.error("❌ endInnings error:", errorMsg);

    // ✅ Throw normalized error
    throw new Error(errorMsg);
  }
}

}

export default matchesAPI
