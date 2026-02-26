import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, Pause, RotateCcw, Save, Users, Target, Trophy } from 'lucide-react'
import { matchesAPI, scoringAPI } from '../../services/api'
import toast from 'react-hot-toast'

const LiveControl = () => {
  const { id } = useParams()
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [scoring, setScoring] = useState(null)
  const [activeTab, setActiveTab] = useState('scoreboard')

  useEffect(() => {
    fetchMatch()
  }, [id])

  const fetchMatch = async () => {
    try {
      setLoading(true)
      const [matchRes, scoringRes] = await Promise.all([
        matchesAPI.getById(id),
        scoringAPI.getMatchScoring(id)
      ])
      setMatch(matchRes.data)
      setScoring(scoringRes.data)
    } catch (error) {
      toast.error('Failed to fetch match data')
      console.error(error)
    } finally {
      setLoading(false)
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

  const handleAddBall = async (runs, isWicket) => {
    try {
      await scoringAPI.updateBall(id, { runs, isWicket })
      toast.success('Ball added')
      fetchMatch()
    } catch (error) {
      toast.error('Failed to add ball')
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
          {match.status === 'live' ? (
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
            <p className="text-2xl font-bold text-primary-600">{scoring?.team1Score || '0/0'}</p>
            <p className="text-sm text-gray-500">{scoring?.team1Overs || '0.0'} overs</p>
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
            <p className="text-2xl font-bold text-primary-600">{scoring?.team2Score || '0/0'}</p>
            <p className="text-sm text-gray-500">{scoring?.team2Overs || '0.0'} overs</p>
          </div>
        </div>
      </div>

      {/* Quick Score Buttons */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Score</h3>
        <div className="grid grid-cols-6 gap-2 mb-4">
          {[0, 1, 2, 3, 4, 6].map((run) => (
            <button
              key={run}
              onClick={() => handleAddBall(run, false)}
              className="py-3 bg-gray-100 hover:bg-primary-100 rounded-lg font-semibold text-gray-800 transition"
            >
              {run}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleAddBall(0, true)}
            className="py-3 bg-red-100 hover:bg-red-200 rounded-lg font-semibold text-red-700 transition"
          >
            Wicket
          </button>
          <button
            onClick={() => handleAddBall(1, false)}
            className="py-3 bg-blue-100 hover:bg-blue-200 rounded-lg font-semibold text-blue-700 transition"
          >
            Wide + 1
          </button>
        </div>
      </div>

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
            onClick={() => setActiveTab(' Commentary')}
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
                      {(scoring?.batters || []).map((batsman, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="py-2">{batsman.name}</td>
                          <td>{batsman.runs}</td>
                          <td>{batsman.balls}</td>
                          <td>{batsman.fours}</td>
                          <td>{batsman.sixes}</td>
                          <td>{batsman.strikeRate}</td>
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
                      {(scoring?.bowlers || []).map((bowler, idx) => (
                        <tr key={idx} className="border-b border-gray-100">
                          <td className="py-2">{bowler.name}</td>
                          <td>{bowler.overs}</td>
                          <td>{bowler.maidens}</td>
                          <td>{bowler.runs}</td>
                          <td>{bowler.wickets}</td>
                          <td>{bowler.economy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'innings' && (
            <div className="text-center py-8 text-gray-500">
              Innings data will be displayed here
            </div>
          )}

          {activeTab === 'commentary' && (
            <div className="space-y-3">
              {(scoring?.commentary || []).map((comment, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-800">{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{comment.over}.{comment.ball}</p>
                </div>
              ))}
              {(!scoring?.commentary || scoring.commentary.length === 0) && (
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
