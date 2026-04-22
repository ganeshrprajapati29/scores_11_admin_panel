import React, { useState, useEffect } from 'react'
import { useSocket } from '../../context/SocketContext'
import matchService from '../../services/match.service'
import { scoringService } from '../../services/scoring.service'
import { Loader, Button } from '../../components/common'
import { Activity } from 'lucide-react'

const LiveScorecards = () => {

  const [liveMatches, setLiveMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedMatch, setExpandedMatch] = useState(null)

  const [playerDropdown, setPlayerDropdown] = useState(null)

  const [showModal, setShowModal] = useState(false)
  const [selectedRun, setSelectedRun] = useState(0)

  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState("")
  const [shot, setShot] = useState("")
  const [issue, setIssue] = useState("")

  const { connected } = useSocket()

  const shots = [
    "Defence",
    "Cover Drive",
    "On Drive",
    "Pull Shot",
    "Helicopter Shot"
  ]

  useEffect(() => {
    fetchLiveMatches()
  }, [])

  useEffect(() => {
    if (!connected) return
    const interval = setInterval(() => {
      fetchLiveMatches(true)
    }, 2000)
    return () => clearInterval(interval)
  }, [connected])

  const fetchLiveMatches = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      const res = await matchService.getLiveMatches()

      setLiveMatches(prev => {
        if (JSON.stringify(prev) === JSON.stringify(res)) return prev
        return res
      })

    } catch (e) {
      console.error(e)
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const openRunFlow = (run) => {
    setSelectedRun(run)
    setShowModal(true)
    setStep(1)
  }

  const confirmRun = async (match) => {
    try {
      const current = match.score?.team1 || {}
      let [over, ball] = (current.overs || "0.0").split(".").map(Number)

      ball++
      if (ball > 5) {
        over++
        ball = 0
      }

      await scoringService.addBall(match._id, {
        overNumber: over,
        ballNumber: ball,
        runs: selectedRun,
        shotType: shot,
        direction,
        comment: issue
      })

      fetchLiveMatches(true)

      setShowModal(false)
      setShot("")
      setDirection("")
      setIssue("")
      setStep(1)

    } catch (e) {
      console.error(e)
    }
  }

  const toggleMatch = (id) => {
    setExpandedMatch(prev => (prev === id ? null : id))
  }

  if (loading) return <Loader text="Loading..." />

  return (
    <div className="p-6 space-y-6">

      <div className="flex items-center gap-4">
        <Activity className="text-blue-600" />
        <h1 className="text-2xl font-bold">Live Scorecards</h1>
      </div>

      {liveMatches.map(match => (
        <div key={match._id} className="border rounded-xl">

          {/* HEADER */}
          <div
            onClick={() => toggleMatch(match._id)}
            className="p-4 bg-gray-100 cursor-pointer"
          >
            {match.team1?.name} vs {match.team2?.name}
            <br />
            {match.score?.team1?.runs || 0}/
            {match.score?.team1?.wickets || 0} (
            {match.score?.team1?.overs || "0.0"})
          </div>

          {expandedMatch === match._id && (
            <div className="p-4 space-y-4">

              {/* 🏏 TOP SCOREBOARD */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-xl">

                <div className="flex justify-between">
                  <div>
                    <h2 className="font-bold">{match.team1?.name}</h2>
                    <p className="text-2xl font-bold">
                      {match.score?.team1?.runs || 0}/{match.score?.team1?.wickets || 0}
                    </p>
                    <p>Overs: {match.score?.team1?.overs || "0.0"}</p>
                  </div>

                  <div className="text-right">
                    <p>Run Rate</p>
                    <p className="text-xl font-bold">
                      {match.score?.team1?.overs
                        ? (
                            (match.score.team1.runs || 0) /
                            (parseFloat(match.score.team1.overs) || 1)
                          ).toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 text-sm border-t pt-2">
                  <p>
                    🏏 {match.currentPlayers?.striker?.name} *
                    ({match.currentPlayers?.striker?.runs || 0}/{match.currentPlayers?.striker?.balls || 0})
                  </p>
                  <p>
                    {match.currentPlayers?.nonStriker?.name}
                    ({match.currentPlayers?.nonStriker?.runs || 0}/{match.currentPlayers?.nonStriker?.balls || 0})
                  </p>
                  <p>
                    🎯 {match.currentPlayers?.bowler?.name}
                    ({match.currentPlayers?.bowler?.overs || 0} ov)
                  </p>
                </div>

                <div className="mt-2 text-xs bg-blue-900 p-2 rounded">
                  Last Ball: {match.lastBall?.runs || 0} |
                  {match.lastBall?.shotType || "-"} |
                  {match.lastBall?.direction || "-"}
                </div>
              </div>

              {/* PLAYER DROPDOWN */}
              <div className="bg-gray-50 p-4 rounded border">
                <div className="grid grid-cols-2 gap-3 text-sm">

                  {/* STRIKER */}
                  <div className="relative bg-white p-3 border rounded">
                    <p>Striker</p>
                    <div onClick={() => setPlayerDropdown("striker")} className="cursor-pointer">
                      {match.currentPlayers?.striker?.name} ⬇
                    </div>

                    {playerDropdown === "striker" && (
                      <div className="absolute bg-white border mt-2 w-full z-20">
                        {(match.team1?.players || []).map(p => (
                          <div
                            key={p._id}
                            className="p-2 hover:bg-gray-100"
                            onClick={() => {
                              scoringService.changePlayers(match._id, { strikerId: p._id })
                              setPlayerDropdown(null)
                            }}
                          >
                            {p.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* NON STRIKER */}
                  <div className="relative bg-white p-3 border rounded">
                    <p>Non-Striker</p>
                    <div onClick={() => setPlayerDropdown("nonStriker")} className="cursor-pointer">
                      {match.currentPlayers?.nonStriker?.name} ⬇
                    </div>

                    {playerDropdown === "nonStriker" && (
                      <div className="absolute bg-white border mt-2 w-full z-20">
                        {(match.team1?.players || []).map(p => (
                          <div
                            key={p._id}
                            className="p-2 hover:bg-gray-100"
                            onClick={() => {
                              scoringService.changePlayers(match._id, { nonStrikerId: p._id })
                              setPlayerDropdown(null)
                            }}
                          >
                            {p.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* BOWLER */}
                  <div className="relative bg-white p-3 border rounded col-span-2">
                    <p>Bowler</p>
                    <div onClick={() => setPlayerDropdown("bowler")} className="cursor-pointer">
                      {match.currentPlayers?.bowler?.name} ⬇
                    </div>

                    {playerDropdown === "bowler" && (
                      <div className="absolute bg-white border mt-2 w-full z-20">
                        {(match.team2?.players || []).map(p => (
                          <div
                            key={p._id}
                            className="p-2 hover:bg-gray-100"
                            onClick={() => {
                              scoringService.changePlayers(match._id, { bowlerId: p._id })
                              setPlayerDropdown(null)
                            }}
                          >
                            {p.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* RUN BUTTONS */}
              <div className="flex gap-2 flex-wrap">
                {[0,1,2,3,4,6].map(r => (
                  <Button key={r} onClick={() => openRunFlow(r)}>{r}</Button>
                ))}
              </div>

              {/* MAP + SHOT */}
              {showModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
                  <div className="bg-white p-6 rounded w-[400px]">

                    <h2>Run: {selectedRun}</h2>

                    {step === 1 && (
                      <div className="grid grid-cols-2 gap-2">
                        {["Cover","Point","MidWicket","LongOn"].map(d => (
                          <Button key={d} onClick={() => {
                            setDirection(d)
                            setStep(2)
                          }}>
                            {d}
                          </Button>
                        ))}
                      </div>
                    )}

                    {step === 2 && (
                      <>
                        {shots.map(s => (
                          <Button key={s} onClick={()=>setShot(s)}>{s}</Button>
                        ))}
                        <input onChange={(e)=>setIssue(e.target.value)} />
                        <Button onClick={()=>confirmRun(match)}>Confirm</Button>
                      </>
                    )}

                    <Button onClick={()=>setShowModal(false)}>Cancel</Button>

                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      ))}

      <div className="fixed bottom-4 right-4">
        {connected ? "🟢 Live" : "🔴 Offline"}
      </div>

    </div>
  )
}

export default LiveScorecards 