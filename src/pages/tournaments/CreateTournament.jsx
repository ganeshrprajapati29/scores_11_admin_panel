import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Upload, Users } from 'lucide-react'
import { tournamentsAPI, teamsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const CreateTournament = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [teams, setTeams] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    shortName: '',
    description: '',
    format: 'T20',
    tournamentType: 'league',
    startDate: '',
    endDate: '',
    venue: '',
    city: '',
    country: '',
    prizeMoney: '',
    maxTeams: 8,
    teams: [],
    rules: '',
    logo: null
  })

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      const response = await teamsAPI.getAll({ limit: 100 })
      setTeams(response.data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }))
    }
  }

  const handleTeamToggle = (teamId) => {
    setFormData(prev => {
      const teams = prev.teams.includes(teamId)
        ? prev.teams.filter(id => id !== teamId)
        : [...prev.teams, teamId]
      return { ...prev, teams }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => {
        if (key === 'teams') {
          data.append(key, JSON.stringify(formData[key]))
        } else if (formData[key]) {
          data.append(key, formData[key])
        }
      })

      await tournamentsAPI.create(data)
      toast.success('Tournament created successfully')
      navigate('/tournaments')
    } catch (error) {
      toast.error(error.message || 'Failed to create tournament')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/tournaments" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create Tournament</h1>
          <p className="text-gray-500">Create a new tournament</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tournament Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tournament Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="Enter tournament name"
                required
              />
            </div>

            {/* Short Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Name *
              </label>
              <input
                type="text"
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
                className="input"
                placeholder="e.g., IPL 2024"
                maxLength={20}
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input"
                placeholder="Enter tournament description"
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

            {/* Tournament Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tournament Type
              </label>
              <select
                name="tournamentType"
                value={formData.tournamentType}
                onChange={handleChange}
                className="input"
              >
                <option value="league">League</option>
                <option value="knockout">Knockout</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="input"
                placeholder="Enter venue"
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

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="input"
                placeholder="Enter country"
              />
            </div>

            {/* Prize Money */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prize Money
              </label>
              <input
                type="number"
                name="prizeMoney"
                value={formData.prizeMoney}
                onChange={handleChange}
                className="input"
                placeholder="Enter prize money"
              />
            </div>

            {/* Max Teams */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Teams
              </label>
              <input
                type="number"
                name="maxTeams"
                value={formData.maxTeams}
                onChange={handleChange}
                className="input"
                min={2}
                max={20}
              />
            </div>

            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tournament Logo
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                    <Upload size={18} />
                    <span>Upload Logo</span>
                  </div>
                </label>
                {formData.logo && (
                  <span className="text-sm text-gray-500">{formData.logo.name}</span>
                )}
              </div>
            </div>

            {/* Teams Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Teams ({formData.teams.length}/{formData.maxTeams})
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                {teams.map(team => (
                  <button
                    key={team._id}
                    type="button"
                    onClick={() => handleTeamToggle(team._id)}
                    disabled={!formData.teams.includes(team._id) && formData.teams.length >= formData.maxTeams}
                    className={`p-2 rounded-lg text-sm text-left transition ${
                      formData.teams.includes(team._id)
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      <span className="truncate">{team.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rules
              </label>
              <textarea
                name="rules"
                value={formData.rules}
                onChange={handleChange}
                rows={4}
                className="input"
                placeholder="Enter tournament rules"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
            <Link to="/tournaments" className="btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? 'Creating...' : 'Create Tournament'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTournament
