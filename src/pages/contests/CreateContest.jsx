import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft } from 'lucide-react'
import { contestsAPI, matchesAPI } from '../../services/api'
import toast from 'react-hot-toast'

const CreateContest = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    match: '',
    entryFee: 0,
    prizePool: 0,
    maxTeams: 100,
    status: 'active',
    description: '',
    winningPercentage: JSON.stringify([40, 30, 20, 10])
  })

  useEffect(() => {
    fetchMatches()
    if (isEdit) {
      fetchContest()
    }
  }, [id])

  const fetchMatches = async () => {
    try {
      const response = await matchesAPI.getUpcoming({ limit: 50 })
      setMatches(response.data || [])
    } catch (error) {
      console.error('Failed to fetch matches:', error)
    }
  }

  const fetchContest = async () => {
    try {
      setLoading(true)
      const response = await contestsAPI.getById(id)
      const contest = response.data || response
      setFormData({
        name: contest.name || '',
        match: contest.match?._id || contest.match || '',
        entryFee: contest.entryFee || 0,
        prizePool: contest.prizePool || 0,
        maxTeams: contest.maxTeams || 100,
        status: contest.status || 'active',
        description: contest.description || '',
        winningPercentage: contest.winningPercentage 
          ? (typeof contest.winningPercentage === 'string' 
              ? contest.winningPercentage 
              : JSON.stringify(contest.winningPercentage))
          : JSON.stringify([40, 30, 20, 10])
      })
    } catch (error) {
      toast.error('Failed to fetch contest')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      let winningPercentage
      try {
        winningPercentage = JSON.parse(formData.winningPercentage)
      } catch {
        winningPercentage = [40, 30, 20, 10]
      }

      const data = {
        ...formData,
        winningPercentage
      }

      if (isEdit) {
        await contestsAPI.update(id, data)
        toast.success('Contest updated successfully')
      } else {
        await contestsAPI.create(data)
        toast.success('Contest created successfully')
      }
      navigate('/contests')
    } catch (error) {
      toast.error(error.message || 'Failed to save contest')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/contests')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Contest' : 'Create Contest'}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEdit ? 'Update contest details' : 'Create a new contest'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contest Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contest Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input w-full"
                placeholder="Enter contest name"
              />
            </div>

            {/* Match Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Match *
              </label>
              <select
                name="match"
                value={formData.match}
                onChange={handleChange}
                required
                className="input w-full"
              >
                <option value="">Select a match</option>
                {matches.map(match => (
                  <option key={match._id} value={match._id}>
                    {match.team1?.name} vs {match.team2?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Entry Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entry Fee *
              </label>
              <input
                type="number"
                name="entryFee"
                value={formData.entryFee}
                onChange={handleChange}
                required
                min="0"
                className="input w-full"
                placeholder="0"
              />
            </div>

            {/* Prize Pool */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prize Pool *
              </label>
              <input
                type="number"
                name="prizePool"
                value={formData.prizePool}
                onChange={handleChange}
                required
                min="0"
                className="input w-full"
                placeholder="0"
              />
            </div>

            {/* Max Teams */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Teams *
              </label>
              <input
                type="number"
                name="maxTeams"
                value={formData.maxTeams}
                onChange={handleChange}
                required
                min="2"
                max="10000"
                className="input w-full"
                placeholder="100"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="input w-full"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Winning Percentage */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Winning Percentage Distribution (JSON Array)
              </label>
              <input
                type="text"
                name="winningPercentage"
                value={formData.winningPercentage}
                onChange={handleChange}
                className="input w-full"
                placeholder='[40, 30, 20, 10]'
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter as JSON array representing percentage for top positions
              </p>
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
                rows="4"
                className="input w-full"
                placeholder="Enter contest description"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/contests')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary inline-flex items-center gap-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save size={18} />
              )}
              {isEdit ? 'Update Contest' : 'Create Contest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateContest
