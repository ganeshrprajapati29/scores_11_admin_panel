import React, { useState, useEffect } from 'react'
import { useSocket } from '../../context/SocketContext'

// 🔥 FIXED PATH (2 level up)
import matchService from '../../services/match.service'

// 🔥 Check karo ye named export hai
import { scoringService } from '../../services/scoring.service'

import { Loader, Table, Button } from '../../components/common'
import { classNames } from '../../utils/helpers'

// 🔥 lucide icons
import { LayoutDashboard, Activity, Trophy, Users, Clock } from 'lucide-react'

const LiveScorecards = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMatch, setExpandedMatch] = useState(null);

  const { socket, connected, joinLiveMatchRooms, leaveLiveMatchRooms } = useSocket();

  useEffect(() => {
    fetchLiveMatches();
  }, []);

  useEffect(() => {
    if (socket && liveMatches.length > 0) {
      const matchIds = liveMatches.map(m => m._id);

      joinLiveMatchRooms(matchIds);

      socket.on('liveScoreUpdate', handleLiveUpdate);

      return () => {
        leaveLiveMatchRooms(matchIds);
        socket.off('liveScoreUpdate', handleLiveUpdate);
      };
    }
  }, [socket, liveMatches]);

  const fetchLiveMatches = async () => {
    try {
      setLoading(true);
      const response = await matchService.getLiveMatches();
      setLiveMatches(response);
    } catch (error) {
      console.error('Failed to fetch live matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLiveUpdate = (data) => {
    setLiveMatches(prev =>
      prev.map(match =>
        match._id === data.matchId
          ? {
              ...match,
              score: data.score,
              currentInnings: data.currentInnings,
            }
          : match
      )
    );
  };

  // 🔥 NEXT BALL CALCULATION
  const getNextBall = (overs = "0.0", type = "run") => {
  // ✅ safe default
  if (!overs || typeof overs !== "string") {
    overs = "0.0";
  }

  let parts = overs.split(".");

  let over = Number(parts[0]) || 0;
  let ball = Number(parts[1]) || 0;

  // 🔥 wide / no-ball pe ball count same rahega
  if (type !== "wide" && type !== "no-ball") {
    ball++;
  }

  if (ball > 5) {
    over += 1;
    ball = 0;
  }

  return `${over}.${ball}`;
};
  // 🔥 MAIN SCORING FUNCTION
  

  const toggleMatch = async (matchId) => {
  try {
    if (expandedMatch === matchId) {
      setExpandedMatch(null);
      return;
    }

    setExpandedMatch(matchId);

    const response = await scoringService.getLiveScore(matchId);

    // ✅ normalize response
    const data = response?.data || response || {};

    console.log("📊 Live Score API:", data);

    setLiveMatches(prev =>
      prev.map(match =>
        match._id === matchId
          ? {
              ...match,

              // ✅ IMPORTANT FIX: correct nesting
              score: data?.score || match.score,

              scorecard: {
                ...match.scorecard,

                // 🔥 FIX: correct path
                currentInnings:
                  data?.scorecard?.currentInnings ||
                  data?.currentInnings ||
                  {},

                // optional: full scorecard store karo
                full: data?.scorecard || {},
              },
            }
          : match
      )
    );

  } catch (error) {
    console.error("❌ Error fetching scorecard:", {
      message: error?.message,
      response: error?.response?.data,
    });
  }
};

  if (loading) return <Loader text="Loading live matches..." />;

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Activity className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Live Scorecards</h1>
          <p>{connected ? '🔴 Live' : '⚫ Offline'} | {liveMatches.length} matches</p>
        </div>
        <Button onClick={fetchLiveMatches}>
          <Clock className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* MATCH LIST */}
      {liveMatches.map((match) => (
        <div key={match._id} className="border rounded-xl">

          {/* HEADER */}
          <div
            className="p-4 bg-gray-100 cursor-pointer"
            onClick={() => toggleMatch(match._id)}
          >
            <h2 className="font-bold">
              {match.team1?.name} vs {match.team2?.name}
            </h2>

            <p>
              {match.score?.team1?.runs || 0}/
              {match.score?.team1?.wickets || 0} (
              {match.score?.team1?.overs || "0.0"})
            </p>
          </div>

          {/* EXPANDED */}
         {expandedMatch === match._id && (
  <div className="p-4 bg-gray-50">

    {/* QUICK CONTROLS */}
    <div className="flex gap-2 flex-wrap">

      <Button onClick={() => handleAddBall(match, 1)}>+1</Button>
      <Button onClick={() => handleAddBall(match, 2)}>+2</Button>
      <Button onClick={() => handleAddBall(match, 3)}>+3</Button>
      <Button onClick={() => handleAddBall(match, 4)}>4</Button>
      <Button onClick={() => handleAddBall(match, 6)}>6</Button>

      <Button onClick={() => handleAddBall(match, 0, "wicket")}>
        Wicket
      </Button>

      <Button onClick={() => handleAddBall(match, 0, "wide")}>
        Wide
      </Button>

    </div>

    {/* SCORECARD */}
    <div className="mt-4">
      <p>Overs: {match.score?.team1?.overs}</p>
      <p>Runs: {match.score?.team1?.runs}</p>
      <p>Wickets: {match.score?.team1?.wickets}</p>
    </div>

  </div>
)}
        </div>
      ))}

      {/* SOCKET STATUS */}
      <div className="fixed bottom-4 right-4">
        {connected ? "🟢 Connected" : "🔴 Disconnected"}
      </div>
    </div>
  );
};

export default LiveScorecards;