import { useEffect, useState } from "react"
import matchesAPI from "../../services/match.service"
import { scoringAPI } from "../../services/api"


const LiveMatches = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editData, setEditData] = useState({});
  const [actionLoading, setActionLoading] = useState(false);



  const [players, setPlayers] = useState({
    striker: "",
    nonStriker: "",
    bowler: "",
  })

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const fetchLoop = async () => {
      if (!isMounted) return;

      try {
        await fetchMatch(true);
      } catch (err) {
        console.error("Fetch error:", err);
      }

      // 🔥 retry after 5 sec (reduce load)
      if (isMounted) {
        timeoutId = setTimeout(fetchLoop, 5000);
      }
    };

    // ✅ first load only
    fetchMatch(true);

    // ❌ continuous polling avoid karo
    // ✅ fallback ke liye optional
    timeoutId = setTimeout(fetchLoop, 5000);

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // ✅ FINAL FIXED FETCH
  const fetchMatch = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true)

      const res = await matchesAPI.getAllMatches()

      // safe extraction
      const data =
        res?.data?.matches ||
        res?.data ||
        res ||
        []

      // ensure array
      const matchesArray = Array.isArray(data) ? data : []

      setMatches(matchesArray)

    } catch (err) {
      console.error("Fetch match error:", err)
      setMatches([]) // fallback safe state
    } finally {
      if (showLoader) setLoading(false)
    }
  }

  const getPlayerName = (player) => {
    if (!player) return "N/A"
    if (typeof player === "object") return player.name || "N/A"
    return "Loading..."
  }

  const handlePlayerChange = (field, value) => {
    setPlayers((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleScore = async (match, type, runs = 0) => {
    try {
      const innings = match.currentInnings || 1;

      const currentScore =
        innings === 1
          ? match.score?.team1
          : match.score?.team2;

      let [over, ball] = (currentScore?.overs || "0.0")
        .split(".")
        .map(Number);

      let newOver = over;
      let newBall = ball;

      // ball increment logic
      if (type !== "wide" && type !== "noball") {
        newBall += 1;

        if (newBall >= 6) {
          newOver += 1;
          newBall = 0;
        }
      }

      // ✅ IMPORTANT: purana data preserve karo
      const payload = {
        type,
        runs,
        innings,

        overNumber: newOver,
        ballNumber: newBall,

        strikerName: players.striker,
        nonStrikerName: players.nonStriker,
        bowlerName: players.bowler,

        // 🔥 ye add karo (existing data preserve)
        totalRuns: currentScore?.runs || 0,
        wickets: currentScore?.wickets || 0,
        overs: `${newOver}.${newBall}`,
      };

      console.log("✅ PAYLOAD:", payload);

      await scoringAPI.updateBall(match._id, payload);

    } catch (err) {
      console.error("❌ handleScore error:", err);
    }
  };




  const [endingInningsId, setEndingInningsId] = useState(null);

  const handleEndInnings = async (match) => {
    if (!match?._id) {
      console.error("❌ Match ID missing");
      return;
    }

    if (Number(match.currentInnings) === 2) {
      console.warn("⚠️ Already in 2nd innings");
      return;
    }

    if (endingInningsId === match._id) {
      console.warn("⏳ Already processing...");
      return;
    }

    try {
      setEndingInningsId(match._id);

      console.log("🚀 Ending innings for match:", match._id);

      const res = await matchesAPI.endInnings(match._id);

      const updatedMatch =
        res?.data?.data ||
        res?.data?.match ||
        res?.data ||
        res;

      if (!updatedMatch?._id) {
        throw new Error("Invalid response from server");
      }

      console.log("✅ End innings success:", updatedMatch);

      // 🔥 FINAL SAFE MERGE
      setSelectedMatch((prev) => {
        if (!prev || prev._id !== updatedMatch._id) return prev;

        return {
          ...prev,
          ...updatedMatch,

          // ✅ DEEP SAFE SCORE MERGE (NO RESET EVER)
          score: {
            team1: {
              runs:
                updatedMatch?.score?.team1?.runs ??
                prev?.score?.team1?.runs ??
                0,
              wickets:
                updatedMatch?.score?.team1?.wickets ??
                prev?.score?.team1?.wickets ??
                0,
              overs:
                updatedMatch?.score?.team1?.overs ??
                prev?.score?.team1?.overs ??
                "0.0",
            },

            team2: {
              runs:
                updatedMatch?.score?.team2?.runs ??
                prev?.score?.team2?.runs ??
                0,
              wickets:
                updatedMatch?.score?.team2?.wickets ??
                prev?.score?.team2?.wickets ??
                0,
              overs:
                updatedMatch?.score?.team2?.overs ??
                prev?.score?.team2?.overs ??
                "0.0",
            },
          },

          currentInnings:
            updatedMatch.currentInnings ?? prev.currentInnings,
        };
      });

    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to end innings";

      console.error("❌ End innings error:", errorMsg);

      if (window?.toast) {
        window.toast.error(errorMsg);
      } else {
        alert(errorMsg);
      }

    } finally {
      setEndingInningsId(null);
    }
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleUpdate = async (match) => {
    if (!match || actionLoading) return;

    setActionLoading(true);

    try {
      const payload = {};

      // ✅ ONLY send if user typed value
      if (editData.runs !== "" && editData.runs !== undefined) {
        payload.runs = Number(editData.runs);
      }

      if (editData.wickets !== "" && editData.wickets !== undefined) {
        payload.wickets = Number(editData.wickets);
      }

      if (editData.overs !== "" && editData.overs !== undefined) {
        payload.overs = editData.overs;
      }

      console.log("✅ FINAL PAYLOAD:", payload);

      await matchesAPI.updateScore(match._id, payload);

      fetchMatch(true);

    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setActionLoading(false);
    }


    const getCurrentBattingTeam = (match) => {
      if (!match) return null;

      return Number(match?.currentInnings) === 1
        ? match?.team1
        : match?.team2;
    };

    const getBattingPlayers = (match) => {
      const team = getCurrentBattingTeam(match);
      return team?.players || [];
    };

    // ✅ FIXED (safe + always defined)
    const battingPlayers = getBattingPlayers(selectedMatch || null);


  };

  // =========================
  // 📋 MATCH LIST
  // =========================
  if (!selectedMatch) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          🏏 All Matches
        </h1>

        {matches?.length === 0 && (
          <p className="text-center text-gray-400 text-lg">
            No Matches Found
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {matches?.map((m, index) => (
            <div
              key={m._id || m.id || index}
              onClick={() => setSelectedMatch(m)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer border border-gray-100 flex flex-col justify-between h-full"
            >
              {/* 🔴 LIVE BADGE */}
              {m.status === "live" && (
                <div className="bg-red-500 text-white text-xs py-1 text-center animate-pulse rounded-t-2xl">
                  🔴 LIVE
                </div>
              )}

              <div className="p-4 flex flex-col flex-grow">

                {/* Teams */}
                <h2 className="font-semibold text-gray-800 text-center text-lg mb-3 min-h-[48px] flex items-center justify-center">
                  {m.team1?.name || "Team A"}{" "}
                  <span className="text-blue-500 font-bold mx-1">vs</span>{" "}
                  {m.team2?.name || "Team B"}
                </h2>

                {/* Score */}
                <div className="bg-gray-50 rounded-lg p-3 text-center mb-3">
                  <p className="text-2xl font-bold text-blue-600">
                    {m.score?.team1?.runs || 0}/{m.score?.team1?.wickets || 0}
                  </p>
                  <p className="text-xs text-gray-500">Score</p>
                </div>

                {/* Status */}
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="text-gray-500">Status</span>

                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${m.status === "live"
                      ? "bg-red-100 text-red-600"
                      : m.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                      }`}
                  >
                    {m.status || "N/A"}
                  </span>
                </div>

                {/* Spacer push button down */}
                <div className="flex-grow"></div>

                {/* Button */}
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 rounded-lg transition">
                  View Scoring →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }













  // =========================
  // 🏏 SCORING PANEL
  // =========================
  const match = selectedMatch
  const innings = match.currentInnings || 1

  // ✅ Dono teams ka score
  const team1Score = match.score?.team1 || {
    runs: 0,
    wickets: 0,
    overs: "0.0"
  }

  const team2Score = match.score?.team2 || {
    runs: 0,
    wickets: 0,
    overs: "0.0"
  }

  const battingTeam =
    innings === 1 ? match.team1 : match.team2

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* Back */}
      <button
        onClick={() => setSelectedMatch(null)}
        className="mb-5 text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg"
      >
        ⬅ Back
      </button>

      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        🏏 Scoring Panel
      </h1>

  



      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">

        {/* 🔝 TOP DATA */}
        <div className="bg-blue-600 text-white p-5 rounded-t-2xl">

          {/* 🏏 Teams */}
          <div className="flex justify-between items-center mb-3">
            <p className="font-semibold text-sm">
              {match.team1?.name || "Team A"}
            </p>

            <span className="text-xs opacity-80">VS</span>

            <p className="font-semibold text-sm text-right">
              {match.team2?.name || "Team B"}
            </p>
          </div>

          {/* 🔥 BOTH TEAMS SCORE */}
          <div className="bg-white/10 p-3 rounded-lg">

            <div className="flex justify-between items-center">

              {/* Team 1 */}
              <div>
                <p className="text-sm opacity-80">
                  {match.team1?.shortName || "T1"}
                </p>

                <p className={`text-2xl font-bold ${innings === 1 ? "text-yellow-300" : ""
                  }`}>
                  {team1Score.runs}/{team1Score.wickets}
                </p>

                <p className="text-xs opacity-80">
                  {team1Score.overs} ov
                </p>
              </div>

              {/* VS */}
              <div className="text-sm opacity-70">
                VS
              </div>

              {/* Team 2 */}
              <div className="text-right">
                <p className="text-sm opacity-80">
                  {match.team2?.shortName || "T2"}
                </p>

                <p className={`text-2xl font-bold ${innings === 2 ? "text-yellow-300" : ""
                  }`}>
                  {team2Score.runs}/{team2Score.wickets}
                </p>

                <p className="text-xs opacity-80">
                  {team2Score.overs} ov
                </p>
              </div>

            </div>

            {/* Batting Team */}
            <div className="text-right mt-2">
              <p className="text-xs opacity-80">Batting</p>
              <p className="font-semibold">
                {battingTeam?.name}
              </p>
            </div>

          </div>

          {/* 👥 Players */}
          <div className="grid grid-cols-3 gap-2 mt-4 text-xs">

            <div className="bg-white/10 p-2 rounded text-center">
              <p className="opacity-80">Striker</p>
              <p className="font-semibold truncate">
                {players.striker || getPlayerName(match.striker)}
              </p>
            </div>

            <div className="bg-white/10 p-2 rounded text-center">
              <p className="opacity-80">Non-Striker</p>
              <p className="font-semibold truncate">
                {players.nonStriker || getPlayerName(match.nonStriker)}
              </p>
            </div>

            <div className="bg-white/10 p-2 rounded text-center">
              <p className="opacity-80">Bowler</p>
              <p className="font-semibold truncate">
                {players.bowler || getPlayerName(match.bowler)}
              </p>
            </div>

          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* 🧾 FORMS */}
          <div className="flex flex-col md:flex-row gap-6">

            {/* Player Form */}
            <div className="flex-1 bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-gray-600">Players</p>

              <input
                placeholder="Striker"
                className="border p-2 w-full rounded-md"
                onChange={(e) => handlePlayerChange("striker", e.target.value)}
              />

              <input
                placeholder="Non-Striker"
                className="border p-2 w-full rounded-md"
                onChange={(e) => handlePlayerChange("nonStriker", e.target.value)}
              />

              <input
                placeholder="Bowler"
                className="border p-2 w-full rounded-md"
                onChange={(e) => handlePlayerChange("bowler", e.target.value)}
              />
            </div>

            {/* Manual Score */}
            <div className="flex-1 bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-gray-600">Manual Score</p>

              <input
                type="number"
                placeholder="Runs"
                className="border p-2 w-full rounded-md"
                onChange={(e) => handleChange("runs", e.target.value)}
              />

              <input
                type="number"
                placeholder="Wickets"
                className="border p-2 w-full rounded-md"
                onChange={(e) => handleChange("wickets", e.target.value)}
              />

              <input
                type="text"
                placeholder="Overs"
                className="border p-2 w-full rounded-md"
                onChange={(e) => handleChange("overs", e.target.value)}
              />

              <button
                onClick={() => handleUpdate(match)}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Update Score
              </button>
            </div>

             <div>



        <h2 className="text-xl font-bold mb-2">
           Current Batting Players
        </h2>

        {(
          (Number(selectedMatch?.currentInnings) === 1
            ? selectedMatch?.team1?.players
            : selectedMatch?.team2?.players) || []
        ).length > 0 ? (
          (Number(selectedMatch?.currentInnings) === 1
            ? selectedMatch?.team1?.players
            : selectedMatch?.team2?.players
          ).map((player) => (
            <div key={player._id}>
              {player.name}
            </div>
          ))
        ) : (
          <p>No players found</p>
        )}
      </div>

          </div>

          {/* ⚡ BUTTONS */}
          <div className="space-y-3">

            <div className="flex gap-2 flex-wrap">
              {[0, 1, 2, 3, 4, 6].map((r) => (
                <button
                  key={r}
                  onClick={() => handleScore(match, "run", r)}
                  className="flex-1 min-w-[60px] bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleScore(match, "wide", 1)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Wide
              </button>

              <button
                onClick={() => handleScore(match, "noball", 1)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                No Ball
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleScore(match, "wicket")}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Wicket
              </button>

              {innings === 1 && (
                <button
                  onClick={() => handleEndInnings(match)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  End Innings
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default LiveMatches