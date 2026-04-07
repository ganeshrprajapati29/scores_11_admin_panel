import { useEffect, useState } from "react"
import matchesAPI from "../../services/match.service"
import { scoringAPI } from "../../services/api"

const LiveMatches = () => {
  const [matches, setMatches] = useState([])
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [editData, setEditData] = useState({})
  const [actionLoading, setActionLoading] = useState(false)

  const [players, setPlayers] = useState({
    striker: "",
    nonStriker: "",
    bowler: "",
  })

  useEffect(() => {
  let isMounted = true
  let timeoutId = null

  const fetchLoop = async () => {
    if (!isMounted) return

    try {
      await fetchMatch(true) // ✅ refresh mode
    } catch (err) {
      console.error("Fetch error:", err)
    }

    // ✅ schedule next call ONLY if still mounted
    if (isMounted) {
      timeoutId = setTimeout(fetchLoop, 3000)
    }
  }

  fetchLoop()

  return () => {
    isMounted = false
    if (timeoutId) clearTimeout(timeoutId)
  }
}, [])

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

  // ✅ SCORE UPDATE
  const handleScore = async (match, type, runs = 0) => {
  try {
    const innings = match.currentInnings || 1

    const currentScore =
      innings === 1
        ? match.score?.team1
        : match.score?.team2

    let [over, ball] = (currentScore?.overs || "0.0")
      .split(".")
      .map(Number)

    let newOver = over
    let newBall = ball

    // ❗ Wide / NoBall me ball count nahi badhega
    if (type !== "wide" && type !== "noball") {
      newBall += 1

      if (newBall >= 6) {
        newOver += 1
        newBall = 0
      }
    }

    const payload = {
      type,
      runs,
      innings,
      overNumber: over,
      ballNumber: newBall,
      strikerName: players.striker,
      nonStrikerName: players.nonStriker,
      bowlerName: players.bowler,
    }

    await scoringAPI.updateBall(match._id, payload)

    // ✅ ✅ INSTANT UI UPDATE (MAIN FIX)
    setScore((prev) => {
      let updatedRuns = prev.runs
      let updatedWickets = prev.wickets

      if (type === "run") updatedRuns += runs
      if (type === "wide") updatedRuns += runs
      if (type === "noball") updatedRuns += runs
      if (type === "wicket") updatedWickets += 1

      return {
        ...prev,
        runs: updatedRuns,
        wickets: updatedWickets,
        overs: `${newOver}.${newBall}`,
      }
    })

    // ✅ optional background sync (UI block nahi karega)
    fetchMatch(true)

  } catch (err) {
    console.error("Score error:", err)
  }
}

  const handleEndInnings = async (match) => {
  if (actionLoading) return

  setActionLoading(true)

  try {
    // toggle innings dynamically
    const nextInnings = match.currentInnings === 1 ? 2 : 1

    await matchesAPI.changeInnings(match._id, nextInnings)

    // reset players for new innings
    setPlayers({
      striker: "",
      nonStriker: "",
      bowler: "",
    })

    // direct refresh (no timeout)
    await fetchMatch()

  } catch (err) {
    console.error("End innings error:", err)
  } finally {
    setActionLoading(false)
  }
}

  const handleChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

 const handleUpdate = async (match) => {
  if (!match || actionLoading) return

  setActionLoading(true)

  try {
    const payload = {
      runs: Number(editData.runs) || 0,
      wickets: Number(editData.wickets) || 0,
      overs: editData.overs || "0.0",
    }

    await matchesAPI.updateScore(match._id, payload)

    // 🔥 refresh without blocking UI
    fetchMatch(true)

  } catch (err) {
    console.error("Update error:", err)
  } finally {
    setActionLoading(false)
  }
}

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
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                m.status === "live"
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

  const score =
    innings === 1
      ? match.score?.team1
      : match.score?.team2

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

  {/* 📊 Score + Overs */}
  <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg">

    {/* Score */}
    <div>
      <p className="text-3xl font-bold">
        {score?.runs || 0}/{score?.wickets || 0}
      </p>
      <p className="text-xs opacity-80">
        Overs: {score?.overs || "0.0"}
      </p>
    </div>

    {/* Batting Team */}
    <div className="text-right">
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

      {/* 🧾 FORMS (JUST BELOW DATA) */}
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

        {/* Manual Score Form */}
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

      </div>

      {/* ⚡ BUTTONS (BOTTOM) */}
      <div className="space-y-3">

        {/* Runs */}
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

        {/* Extras */}
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

        {/* Wicket + End */}
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