import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Users } from 'lucide-react'
import { matchesAPI, teamsAPI, tournamentsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const CreateMatch = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [teams, setTeams] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    tournament: '',
    venue: '',
    city: '',
    scheduledDate: '',
    scheduledTime: '',
    format: 'T20',
    matchType: 'league',
    gender: 'male'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [teamsRes, tournamentsRes] = await Promise.all([
        teamsAPI.getAll({ limit: 100 }),
        tournamentsAPI.getAll({ limit: 100 })
      ])
      setTeams(teamsRes.data || [])
      setTournaments(tournamentsRes.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.team1 === formData.team2) {
      toast.error('Please select different teams')
      return
    }

    setLoading(true)

    try {
      const data = {
        ...formData,
        scheduledDate: formData.scheduledDate && formData.scheduledTime 
          ? `${formData.scheduledDate}T${formData.scheduledTime}:00Z`
          : formData.scheduledDate
      }
      delete data.scheduledTime

      await matchesAPI.create(data)
      toast.success('Match created successfully')
      navigate('/matches')
    } catch (error) {
      toast.error(error.message || 'Failed to create match')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/matches" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create Match</h1>
          <p className="text-gray-500">Schedule a new match</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Team 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team 1 *
              </label>
              <select
                name="team1"
                value={formData.team1}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Team 1</option>
                {teams.map(team => (
                  <option key={team._id} value={team._id}>{team.name}</option>
                ))}
              </select>
            </div>

            {/* Team 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team 2 *
              </label>
              <select
                name="team2"
                value={formData.team2}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Team 2</option>
                {teams.filter(t => t._id !== formData.team1).map(team => (
                  <option key={team._id} value={team._id}>{team.name}</option>
                ))}
              </select>
            </div>

            {/* Tournament */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tournament
              </label>
              <select
                name="tournament"
                value={formData.tournament}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Tournament</option>
                {tournaments.map(tournament => (
                  <option key={tournament._id} value={tournament._id}>{tournament.name}</option>
                ))}
              </select>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue *
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="input"
                placeholder="Enter venue name"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="input"
                placeholder="Enter city"
              />
            </div>

            {/* Scheduled Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            {/* Scheduled Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <select
                name="format"
                value={formData.format}
                onChange={handleChange}
                className="input"
              >
                <option value="T20">T20</option>
                <option value="ODI">ODI</option>
                <option value="Test">Test</option>
                <option value="T10">T10</option>
              </select>
            </div>

            {/* Match Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Match Type
              </label>
              <select
                name="matchType"
                value={formData.matchType}
                onChange={handleChange}
                className="input"
              >
                <option value="league">League</option>
                <option value="knockout">Knockout</option>
                <option value="final">Final</option>
                <option value="semi_final">Semi Final</option>
                <option value="quarter_final">Quarter Final</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
            <Link to="/matches" className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? 'Creating...' : 'Create Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateMatch
