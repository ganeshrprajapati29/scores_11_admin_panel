import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, Plus, Trophy, Calendar, MapPin, 
  Users, DollarSign, Flag, Trash2, Edit, 
  Eye, Play, Pause, CheckCircle, XCircle, Filter, Clock
} from 'lucide-react'
import { tournamentsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([])
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
    type: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchTournaments()
  }, [pagination.page, pagination.limit, filters.status, filters.type])

  const fetchTournaments = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.type && { type: filters.type })
      }
      const response = await tournamentsAPI.getAll(params)
      setTournaments(response.data || [])
      if (response.pagination) {
        setPagination(prev => ({ ...prev, ...response.pagination }))
      }
    } catch (error) {
      toast.error('Failed to fetch tournaments')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchTournaments()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) return
    try {
      await tournamentsAPI.delete(id)
      toast.success('Tournament deleted successfully')
      fetchTournaments()
    } catch (error) {
      toast.error(error.message || 'Failed to delete tournament')
    }
  }

  const handleStatusChange = async (tournament, newStatus) => {
    try {
      await tournamentsAPI.updateStatus(tournament._id, newStatus)
      toast.success('Tournament status updated successfully')
      fetchTournaments()
    } catch (error) {
      toast.error(error.message || 'Failed to update status')
    }
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'draft':
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock, label: 'Draft' }
      case 'registration_open':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: Flag, label: 'Registration Open' }
      case 'registration_closed':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Pause, label: 'Registration Closed' }
      case 'in_progress':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: Play, label: 'In Progress' }
      case 'completed':
        return { bg: 'bg-purple-100', text: 'text-purple-700', icon: CheckCircle, label: 'Completed' }
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Cancelled' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock, label: status }
    }
  }

  const getTypeConfig = (type) => {
    switch (type) {
      case 'league':
        return 'bg-blue-100 text-blue-700'
      case 'knockout':
        return 'bg-red-100 text-red-700'
      case 'championship':
        return 'bg-purple-100 text-purple-700'
      case 'friendly':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (date) => {
    if (!date) return 'TBD'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tournaments Management</h1>
          <p className="text-gray-500 mt-1">Manage all cricket tournaments and competitions</p>
        </div>
        <Link to="/tournaments/create" className="btn-primary inline-flex items-center gap-2">
          <Plus size={18} />
          Create Tournament
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
              <p className="text-sm text-gray-500">Total Tournaments</p>
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
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {tournaments.filter(t => t.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Flag className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Registration Open</p>
              <p className="text-2xl font-bold text-gray-900">
                {tournaments.filter(t => t.status === 'registration_open').length}
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
                {tournaments.filter(t => t.status === 'completed').length}
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
              placeholder="Search tournaments by name..."
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
                className="input w-48"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="registration_open">Registration Open</option>
                <option value="registration_closed">Registration Closed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="input w-40"
              >
                <option value="">All Types</option>
                <option value="league">League</option>
                <option value="knockout">Knockout</option>
                <option value="championship">Championship</option>
                <option value="friendly">Friendly</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))
        ) : tournaments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tournaments found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          tournaments.map((tournament) => {
            const statusConfig = getStatusConfig(tournament.status)
            const StatusIcon = statusConfig.icon

            return (
              <div key={tournament._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                {/* Banner */}
                {tournament.banner?.url ? (
                  <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${tournament.banner.url})` }}>
                    <div className="h-full bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-white/50" />
                  </div>
                )}

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{tournament.name}</h3>
                      <p className="text-sm text-gray-500">{tournament.shortName || tournament.name?.slice(0, 20)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeConfig(tournament.type)}`}>
                      {tournament.type?.charAt(0).toUpperCase() + tournament.type?.slice(1)}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 mb-4">
                    <StatusIcon className={`w-4 h-4 ${statusConfig.text}`} />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={14} className="text-gray-400" />
                      <span>{formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}</span>
                    </div>
                    {tournament.venue?.name && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{tournament.venue.name}, {tournament.venue.city || 'India'}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users size={14} className="text-gray-400" />
                        {tournament.teams?.length || 0}/{tournament.maxTeams || 16} Teams
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy size={14} className="text-gray-400" />
                        {tournament.format || 'T20'}
                      </span>
                    </div>
                    {tournament.entryFee > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign size={14} className="text-gray-400" />
                        <span>Entry Fee: ₹{tournament.entryFee.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Prize */}
                  {tournament.prize && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <span className="font-medium">Prize:</span> {tournament.prize}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <Link
                      to={`/tournaments/${tournament._id}`}
                      className="flex-1 btn-secondary text-center text-sm py-2 flex items-center justify-center gap-1"
                    >
                      <Eye size={14} />
                      View
                    </Link>
                    {tournament.status === 'draft' && (
                      <button
                        onClick={() => handleStatusChange(tournament, 'registration_open')}
                        className="flex-1 btn-primary text-center text-sm py-2 flex items-center justify-center gap-1"
                      >
                        <Flag size={14} />
                        Open Registration
                      </button>
                    )}
                    {tournament.status === 'registration_open' && (
                      <button
                        onClick={() => handleStatusChange(tournament, 'in_progress')}
                        className="flex-1 btn-primary text-center text-sm py-2 flex items-center justify-center gap-1"
                      >
                        <Play size={14} />
                        Start
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(tournament._id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tournaments
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

export default TournamentList
