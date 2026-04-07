import api from '../config/axiosConfig.js';

export const scoringService = {

  // 🔥 AUTO SETUP (IMPORTANT)
  ensureMatchReady: async (matchId) => {
    try {
      const live = await api.get(`/scoring/match/${matchId}/live`);
      const data = live.data;

      // ✅ innings already running
      if (data?.currentInnings) return data;

      // 🟡 Step 1: Initialize
      try {
        await api.post(`/scoring/match/${matchId}/initialize`, {});
      } catch (e) {}

      // 🟡 Step 2: Start innings
      await api.post(`/scoring/match/${matchId}/innings/start`, {
        inningsNumber: 1,
      });

      // 🔥 RETURN UPDATED DATA
      const updated = await api.get(`/scoring/match/${matchId}/live`);
      return updated.data;

    } catch (error) {
      console.error("❌ ensureMatchReady error:", error?.response?.data || error);
      return null;
    }
  },

  // 🔥 NEW: GET PLAYERS SAFELY
  getCurrentPlayers: async (matchId) => {
    try {
      const res = await api.get(`/scoring/match/${matchId}/live`);
      const data = res.data;

      return {
        striker: data?.currentInnings?.striker?._id,
        nonStriker: data?.currentInnings?.nonStriker?._id,
        bowler: data?.currentInnings?.currentBowler?._id,
      };

    } catch (error) {
      console.error("❌ getCurrentPlayers error:", error?.response?.data || error);
      return {};
    }
  },

  // ✅ MAIN BALL API (FIXED)
  addBall: async (matchId, data) => {
    try {
      // 🔥 STEP 1: Ensure innings
      await scoringService.ensureMatchReady(matchId);

      // 🔥 STEP 2: Ensure players
      let { striker, nonStriker, bowler } =
        await scoringService.getCurrentPlayers(matchId);

      // ❌ If missing → STOP
      if (!striker || !bowler) {
        throw new Error("Players not set (striker/bowler missing)");
      }

      // 🔥 STEP 3: Validate payload
      const { overNumber, ballNumber } = data;

      if (overNumber === undefined || ballNumber === undefined) {
        throw new Error("Missing overNumber / ballNumber");
      }

      const payload = {
        ...data,
        batsman: striker,
        bowler: bowler,
      };

      // 🔥 STEP 4: API CALL
      const response = await api.post(
        `/scoring/match/${matchId}/ball`,
        payload
      );

      console.log("✅ Ball Success:", response.data);

      return response.data;

    } catch (error) {
      console.error("❌ addBall FULL ERROR:", {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        payload: data,
      });

      throw error;
    }
  },

  // ✅ alias
  updateBall: async (matchId, data) => {
    return scoringService.addBall(matchId, data);
  },

  getLiveScore: async (matchId) => {
    const response = await api.get(`/scoring/match/${matchId}/live`);
    return response.data;
  },

  getFullScorecard: async (matchId) => {
    const response = await api.get(`/scoring/match/${matchId}/scorecard`);
    return response.data;
  },

  // 🔥 PLAYER SETUP (manual control)
  setPlayers: async (matchId, striker, nonStriker, bowler) => {
    try {
      if (striker) {
        await api.patch(`/scoring/match/${matchId}/striker`, { batsmanId: striker });
      }

      if (nonStriker) {
        await api.patch(`/scoring/match/${matchId}/non-striker`, { batsmanId: nonStriker });
      }

      if (bowler) {
        await api.patch(`/scoring/match/${matchId}/bowler`, { bowlerId: bowler });
      }

    } catch (error) {
      console.warn("⚠️ Player setup warning:", error?.response?.data || error);
    }
  },

};