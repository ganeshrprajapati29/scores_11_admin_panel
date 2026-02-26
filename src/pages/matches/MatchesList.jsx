import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, Plus, Trophy, Calendar, MapPin, 
  Clock, Play, CheckCircle, XCircle, 
  Eye, Trash2, Edit, MoreVertical, Filter
} from 'lucide-react'
import { matchesAPI, tournamentsAPI, teamsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const MatchesList = () => {
  const [matches, setMatches] = useState([])
  const [tournaments, setTournaments] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    tournament: '',
    team: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchTournaments()
    fetchTeams()
  }, [])

  useEffect(() => {
    fetchMatches()
  }, [pagination.page, pagination.limit, filters.status, filters.tournament, filters.team])

  const fetchTournaments = async () => {
    try {
      const response = await tournamentsAPI.getAll({ limit: 100 })
      setTournaments(response.data || [])
    } catch (error) {
      console.error('Failed to fetch tournaments', error)
    }
  }

  const fetchTeams = async () => {
    try {
      const response = await teamsAPI.getAll({ limit: 100 })
      setTeams(response.data || [])
    } catch (error) {
      console.error('Failed to fetch teams', error)
    }
  }

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.tournament && { tournament: filters.tournament })
      }
      const response = await matchesAPI.getAll(params)
      setMatches(response.data || [])
      if (response.pagination) {
        setPagination(prev => ({ ...prev, ...response.pagination }))
      }
    } catch (error) {
      toast.error('Failed to fetch matches')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchMatches()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this match?')) return
    try {
      await matchesAPI.delete(id)
      toast.success('Match deleted successfully')
      fetchMatches()
    } catch (error) {
      toast.error(error.message || 'Failed to delete match')
    }
  }

  const handleStatusChange = async (match, newStatus) => {
    try {
      await matchesAPI.updateStatus(match._id, newStatus)
      toast.success('Match status updated successfully')
      fetchMatches()
    } catch (error) {
      toast.error(error.message || 'Failed to update status')
    }
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'scheduled':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: Calendar, label: 'Scheduled' }
      case 'live':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: Play, label: 'Live' }
      case 'completed':
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: CheckCircle, label: 'Completed' }
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Cancelled' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock, label: status }
    }
  }

  const getTeamName = (teamId) => {
    const team = teams.find(t => t._id === teamId)
    return team?.name || 'TBD'
  }

  const getTeamShortName = (teamId) => {
    const team = teams.find(t => t._id === teamId)
    return team?.shortName || 'TBD'
  }

  const formatDate = (date) => {
    if (!date) return 'TBD'
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Matches Management</h1>
          <p className="text-gray-500 mt-1">Manage all cricket matches and tournaments</p>
        </div>
        <Link to="/matches/create" className="btn-primary inline-flex items-center gap-2">
          <Plus size={18} />
          Schedule Match
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Matches</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Play className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Live Matches</p>
              <p className="text-2xl font-bold text-gray-900">
                {matches.filter(m => m.status === 'live').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">
                {matches.filter(m => m.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {matches.filter(m => m.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search matches..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="input pl-10 w-full"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Filter size={18} />
            Filters
          </button>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="input w-40"
              >
                <option value="">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tournament</label>
              <select
                value={filters.tournament}
                onChange={(e) => setFilters(prev => ({ ...prev, tournament: e.target.value }))}
                className="input w-48"
              >
                <option value="">All Tournaments</option>
                {tournaments.map(t => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
              <select className="input w-40">
                <option value="">All Formats</option>
                <option value="T20">T20</option>
                <option value="ODI">ODI</option>
                <option value="Test">Test</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))
        ) : matches.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No matches found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          matches.map((match) => {
            const statusConfig = getStatusConfig(match.status)
            const StatusIcon = statusConfig.icon

            return (
              <div key={match._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                {/* Match Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-4 h-4 ${statusConfig.text}`} />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {match.format || 'T20'}
                  </div>
                </div>

                {/* Teams */}
                <div className="space-y-4 mb-4">
                  {/* Team 1 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {match.team1 ? getTeamShortName(match.team1) : 'TBD'}
                      </div>
                      <span className="font-medium text-gray-900">{getTeamName(match.team1)}</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {match.score?.team1?.runs !== undefined ? match.score.team1.runs : '-'}
                    </span>
                  </div>

                  {/* VS */}
                  <div className="flex items-center justify-center">
                    <span className="text-gray-400 text-sm">vs</span>
                  </div>

                  {/* Team 2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {match.team2 ? getTeamShortName(match.team2) : 'TBD'}
                      </div>
                      <span className="font-medium text-gray-900">{getTeamName(match.team2)}</span>
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      {match.score?.team2?.runs !== undefined ? match.score.team2.runs : '-'}
                    </span>
                  </div>
                </div>

                {/* Match Info */}
                <div className="space-y-2 py-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{formatDate(match.scheduledDate)}</span>
                    {match.startTime && <span>• {formatTime(match.scheduledDate)}</span>}
                  </div>
                  {match.venue?.name && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{match.venue.name}, {match.venue.city || 'India'}</span>
                    </div>
                  )}
                  {match.tournament && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Trophy size={14} className="text-gray-400" />
                      <span>{tournaments.find(t => t._id === match.tournament)?.name || 'Tournament'}</span>
                    </div>
                  )}
                </div>

                {/* Match Result */}
                {match.result && match.status === 'completed' && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      {match.result.winner ? `${getTeamName(match.result.winner)} won` : 'Match tied'}
                      {match.result.margin && ` by ${match.result.margin}`}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  {match.status === 'live' ? (
                    <Link
                      to={`/matches/${match._id}/live`}
                      className="flex-1 btn-primary text-center text-sm py-2 flex items-center justify-center gap-1"
                    >
                      <Play size={14} />
                      Live Control
                    </Link>
                  ) : match.status === 'scheduled' ? (
                    <button
                      onClick={() => handleStatusChange(match, 'live')}
                      className="flex-1 btn-primary text-center text-sm py-2 flex items-center justify-center gap-1"
                    >
                      <Play size={14} />
                      Start Match
                    </button>
                  ) : null}
                  
                  <Link
                    to={`/matches/${match._id}`}
                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    onClick={() => handleDelete(match._id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} matches
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MatchesList
