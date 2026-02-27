import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, Pause, Users } from 'lucide-react'
import { matchesAPI, scoringAPI, teamsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const LiveControl = () => {
  const { id } = useParams()
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [scoring, setScoring] = useState(null)
  const [activeTab, setActiveTab] = useState('scoreboard')
  
  // Match state management
  const [currentOver, setCurrentOver] = useState(1)
  const [currentBall, setCurrentBall] = useState(0)
  const [currentInnings, setCurrentInnings] = useState(1)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Current players
  const [striker, setStriker] = useState(null)
  const [nonStriker, setNonStriker] = useState(null)
  const [currentBowler, setCurrentBowler] = useState(null)
  
  // Team players
  const [team1Players, setTeam1Players] = useState([])
  const [team2Players, setTeam2Players] = useState([])

  useEffect(() => {
    fetchMatch()
  }, [id])

  const fetchMatch = async () => {
    try {
      setLoading(true)
      const matchRes = await matchesAPI.getById(id)
      const matchData = matchRes.data
      
      setMatch(matchData)
      setCurrentInnings(matchData.currentInnings || 1)
      
      // Check if match is initialized (has innings data)
      if (matchData.status === 'live' && matchData.innings && matchData.innings.length > 0) {
        setIsInitialized(true)
        
        // Get scoring data
        try {
          const scoringRes = await scoringAPI.getMatchScoring(id)
          setScoring(scoringRes.data)
          
          // Get current state from innings
          const innings = scoringRes.data?.innings?.find(i => i.inningsNumber === (matchData.currentInnings || 1))
          if (innings) {
            const balls = scoringRes.data?.balls || []
            if (balls.length > 0) {
              const lastBall = balls[balls.length - 1]
              setCurrentOver(lastBall.overNumber || 1)
              setCurrentBall(lastBall.ballNumber || 0)
            }
          }
        } catch (scoringErr) {
          console.log('Scoring fetch error:', scoringErr)
        }
      }
      
      // Get players from populated team data - match.team1 and team2 should have players
      if (matchData.team1?.players) {
        setTeam1Players(matchData.team1.players)
      }
      if (matchData.team2?.players) {
        setTeam2Players(matchData.team2.players)
      }
      
    } catch (error) {
      toast.error('Failed to fetch match data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleInitializeMatch = async () => {
    try {
      // Get player IDs from teams
      const battingOrder = [
        { team: match.team1._id, players: team1Players.map(p => p._id || p) },
        { team: match.team2._id, players: team2Players.map(p => p._id || p) }
      ]
      
      await scoringAPI.initializeMatch(id, battingOrder)
      toast.success('Match initialized successfully')
      setIsInitialized(true)
      fetchMatch()
    } catch (error) {
      toast.error('Failed to initialize: ' + (error.message || 'Unknown error'))
      console.error(error)
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await matchesAPI.updateStatus(id, newStatus)
      toast.success(`Match status updated to ${newStatus}`)
      fetchMatch()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const handleAddBall = async (runs, isWicket, extraType = null) => {
    if (!isInitialized) {
      toast.error('Please initialize the match first')
      return
    }

    if (!striker || !nonStriker || !currentBowler) {
      toast.error('Please set striker, non-striker and bowler first')
      return
    }

    try {
      // Calculate ball number
      let ballNum = currentBall + 1
      let overNum = currentOver
      
      if (ballNum > 6) {
        ballNum = 1
        overNum = currentOver + 1
      }

      const battingTeamId = match.team1._id
      const bowlingTeamId = match.team2._id

      const ballData = {
        overNumber: overNum,
        ballNumber: ballNum,
        innings: currentInnings,
        battingTeam: battingTeamId,
        bowlingTeam: bowlingTeamId,
        batsmanId: striker,
        bowlerId: currentBowler,
        runs: runs,
        isWicket: isWicket,
        isWide: extraType === 'wide',
        isNoBall: extraType === 'noBall',
        isBye: extraType === 'bye',
        isLegBye: extraType === 'legBye',
        wicketType: isWicket ? 'caught' : null,
        comment: ''
      }

      await scoringAPI.updateBall(id, ballData)
      toast.success('Ball added')
      
      // Update current ball/over
      setCurrentBall(ballNum)
      setCurrentOver(overNum)
      
      fetchMatch()
    } catch (error) {
      toast.error('Failed to add ball: ' + (error.message || 'Check required fields'))
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Match not found</p>
        <Link to="/matches" className="btn-primary mt-4 inline-block">
          Back to Matches
        </Link>
      </div>
    )
  }

  const currentBattingTeam = currentInnings === 1 ? match.team1 : match.team2
  const currentBowlingTeam = currentInnings === 1 ? match.team2 : match.team1
  const battingPlayers = currentInnings === 1 ? team1Players : team2Players
  const bowlingPlayers = currentInnings === 1 ? team2Players : team1Players

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/matches" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Live Match Control</h1>
            <p className="text-gray-500">{match.team1?.name} vs {match.team2?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isInitialized ? (
            <button
              onClick={handleInitializeMatch}
              className="btn-primary flex items-center gap-2"
            >
              <Play size={18} />
              Initialize Match
            </button>
          ) : match.status === 'live' ? (
            <button
              onClick={() => handleStatusChange('completed')}
              className="btn-danger flex items-center gap-2"
            >
              <Pause size={18} />
              End Match
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange('live')}
              className="btn-primary flex items-center gap-2"
            >
              <Play size={18} />
              Start Match
            </button>
          )}
        </div>
      </div>

      {/* Current Over Display */}
      {isInitialized && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold">Over {currentOver}.{currentBall}</span>
              <span className="text-gray-600">Innings {currentInnings}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Batting: {currentBattingTeam?.name}</span>
              <span className="text-gray-400">|</span>
              <span className="text-sm">Bowling: {currentBowlingTeam?.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* Player Selection */}
      {isInitialized && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Player Selection</h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Striker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Striker</label>
              <select
                value={striker || ''}
                onChange={(e) => setStriker(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Select Batsman</option>
                {battingPlayers.map(p => (
                  <option key={p._id || p} value={p._id || p}>{p.playerName || p.name || 'Player'}</option>
                ))}
              </select>
            </div>
            {/* Non-Striker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Non-Striker</label>
              <select
                value={nonStriker || ''}
                onChange={(e) => setNonStriker(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Select Batsman</option>
                {battingPlayers.filter(p => (p._id || p) !== striker).map(p => (
                  <option key={p._id || p} value={p._id || p}>{p.playerName || p.name || 'Player'}</option>
                ))}
              </select>
            </div>
            {/* Bowler */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bowler</label>
              <select
                value={currentBowler || ''}
                onChange={(e) => setCurrentBowler(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Select Bowler</option>
                {bowlingPlayers.map(p => (
                  <option key={p._id || p} value={p._id || p}>{p.playerName || p.name || 'Player'}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Match Score Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-600 font-medium">LIVE</span>
          </div>
          <span className="text-gray-500">{match.format}</span>
        </div>

        <div className="grid grid-cols-3 items-center">
          {/* Team 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-800">{match.team1?.name || 'Team 1'}</h3>
            <p className="text-2xl font-bold text-primary-600">
              {scoring?.score?.team1?.runs || match.score?.team1?.runs || 0}/{scoring?.score?.team1?.wickets || match.score?.team1?.wickets || 0}
            </p>
            <p className="text-sm text-gray-500">{scoring?.score?.team1?.overs || match.score?.team1?.overs || '0.0'} overs</p>
          </div>

          {/* VS */}
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-300">VS</p>
            <p className="text-sm text-gray-500 mt-2">{match.tournament?.name}</p>
          </div>

          {/* Team 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-800">{match.team2?.name || 'Team 2'}</h3>
            <p className="text-2xl font-bold text-primary-600">
              {scoring?.score?.team2?.runs || match.score?.team2?.runs || 0}/{scoring?.score?.team2?.wickets || match.score?.team2?.wickets || 0}
            </p>
            <p className="text-sm text-gray-500">{scoring?.score?.team2?.overs || match.score?.team2?.overs || '0.0'} overs</p>
          </div>
        </div>
      </div>

      {/* Quick Score Buttons */}
      {isInitialized && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Score</h3>
          <div className="grid grid-cols-6 gap-2 mb-4">
            {[0, 1, 2, 3, 4, 6].map((run) => (
              <button
                key={run}
                onClick={() => handleAddBall(run, false)}
                disabled={!striker || !nonStriker || !currentBowler}
                className="py-3 bg-gray-100 hover:bg-primary-100 rounded-lg font-semibold text-gray-800 transition disabled:opacity-50"
              >
                {run}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleAddBall(0, true)}
              disabled={!striker || !currentBowler}
              className="py-3 bg-red-100 hover:bg-red-200 rounded-lg font-semibold text-red-700 transition disabled:opacity-50"
            >
              Wicket
            </button>
            <button
              onClick={() => handleAddBall(1, false, 'wide')}
              disabled={!currentBowler}
              className="py-3 bg-blue-100 hover:bg-blue-200 rounded-lg font-semibold text-blue-700 transition disabled:opacity-50"
            >
              Wide (+1)
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <button
              onClick={() => handleAddBall(0, false, 'noBall')}
              disabled={!currentBowler}
              className="py-2 bg-orange-100 hover:bg-orange-200 rounded-lg text-sm font-semibold text-orange-700 transition disabled:opacity-50"
            >
              No Ball
            </button>
            <button
              onClick={() => handleAddBall(0, false, 'bye')}
              disabled={!currentBowler}
              className="py-2 bg-purple-100 hover:bg-purple-200 rounded-lg text-sm font-semibold text-purple-700 transition disabled:opacity-50"
            >
              Bye
            </button>
            <button
              onClick={() => handleAddBall(0, false, 'legBye')}
              disabled={!currentBowler}
              className="py-2 bg-pink-100 hover:bg-pink-200 rounded-lg text-sm font-semibold text-pink-700 transition disabled:opacity-50"
            >
              Leg Bye
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('scoreboard')}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'scoreboard'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500'
            }`}
          >
            Scoreboard
          </button>
          <button
            onClick={() => setActiveTab('innings')}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'innings'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500'
            }`}
          >
            Innings
          </button>
          <button
            onClick={() => setActiveTab('commentary')}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'commentary'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500'
            }`}
          >
            Commentary
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'scoreboard' && (
            <div className="space-y-4">
              {/* Batting */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Batting</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2">Batsman</th>
                        <th className="text-left py-2">R</th>
                        <th className="text-left py-2">B</th>
                        <th className="text-left py-2">4s</th>
                        <th className="text-left py-2">6s</th>
                        <th className="text-left py-2">SR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(scoring?.innings?.[0]?.battingScorecard || match.innings?.[0]?.battingScorecard || []).map((batsman, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="py-2">{batsman.batsman?.playerName || batsman.batsman?.name || batsman._id || 'Player'}</td>
                          <td>{batsman.runs}</td>
                          <td>{batsman.balls}</td>
                          <td>{batsman.fours}</td>
                          <td>{batsman.sixes}</td>
                          <td>{batsman.strikeRate?.toFixed(2) || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bowling */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Bowling</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2">Bowler</th>
                        <th className="text-left py-2">O</th>
                        <th className="text-left py-2">M</th>
                        <th className="text-left py-2">R</th>
                        <th className="text-left py-2">W</th>
                        <th className="text-left py-2">Eco</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(scoring?.innings?.[0]?.bowlingScorecard || match.innings?.[0]?.bowlingScorecard || []).map((bowler, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="py-2">{bowler.bowler?.playerName || bowler.bowler?.name || bowler._id || 'Player'}</td>
                          <td>{bowler.overs}</td>
                          <td>{bowler.maidens}</td>
                          <td>{bowler.runsConceded}</td>
                          <td>{bowler.wickets}</td>
                          <td>{bowler.economy?.toFixed(2) || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'innings' && (
            <div className="space-y-4">
              {match.innings?.map((innings, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <h4 className="font-semibold">Innings {innings.inningsNumber}</h4>
                  <p>{innings.totalRuns}/{innings.totalWickets} in {innings.totalOvers}.{innings.totalBalls} overs</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'commentary' && (
            <div className="space-y-3">
              {(match.commentary || []).slice(-10).reverse().map((comment, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-800">{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-1">Over {comment.over}.{comment.ball} - {comment.totalRuns} runs</p>
                </div>
              ))}
              {(!match.commentary || match.commentary.length === 0) && (
                <p className="text-center text-gray-500">No commentary yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LiveControl
