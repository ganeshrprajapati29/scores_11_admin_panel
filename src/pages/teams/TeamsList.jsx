import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, Plus, Users, Trophy, MapPin, 
  Calendar, Award, Trash2, Edit, Eye, 
  CheckCircle, XCircle, Shield, UserPlus
} from 'lucide-react'
import { teamsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const TeamsList = () => {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchTeams()
  }, [pagination.page, pagination.limit, statusFilter])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(search && { search }),
        ...(statusFilter && { isActive: statusFilter })
      }
      const response = await teamsAPI.getAll(params)
      setTeams(response.data || [])
      if (response.pagination) {
        setPagination(prev => ({ ...prev, ...response.pagination }))
      }
    } catch (error) {
      toast.error('Failed to fetch teams')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchTeams()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return
    try {
      await teamsAPI.delete(id)
      toast.success('Team deleted successfully')
      fetchTeams()
    } catch (error) {
      toast.error(error.message || 'Failed to delete team')
    }
  }

  const handleVerify = async (id) => {
    try {
      await teamsAPI.verifyTeam(id)
      toast.success('Team verified successfully')
      fetchTeams()
    } catch (error) {
      toast.error(error.message || 'Failed to verify team')
    }
  }

  const getStatusColor = (isActive, isVerified) => {
    if (!isActive) return 'bg-red-100 text-red-700 border-red-200'
    if (!isVerified) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-green-100 text-green-700 border-green-200'
  }

  const getStatusText = (isActive, isVerified) => {
    if (!isActive) return 'Inactive'
    if (!isVerified) return 'Pending'
    return 'Verified'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teams Management</h1>
          <p className="text-gray-500 mt-1">Manage all cricket teams in the system</p>
        </div>
        <Link to="/teams/create" className="btn-primary inline-flex items-center gap-2">
          <Plus size={18} />
          Create New Team
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Teams</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Verified Teams</p>
              <p className="text-2xl font-bold text-gray-900">
                {teams.filter(t => t.isVerified).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Verification</p>
              <p className="text-2xl font-bold text-gray-900">
                {teams.filter(t => !t.isVerified && t.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Wins</p>
              <p className="text-2xl font-bold text-gray-900">
                {teams.reduce((acc, t) => acc + (t.stats?.matchesWon || 0), 0)}
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
              placeholder="Search teams by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-full md:w-48"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))
        ) : teams.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No teams found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          teams.map((team) => (
            <div key={team._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              {/* Team Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {team.logo ? (
                      <img src={team.logo.url} alt={team.name} className="w-16 h-16 rounded-xl object-cover" />
                    ) : (
                      team.shortName?.slice(0, 2).toUpperCase() || team.name?.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-500">{team.shortName || 'N/A'}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(team.isActive, team.isVerified)}`}>
                  {getStatusText(team.isActive, team.isVerified)}
                </span>
              </div>

              {/* Team Info */}
              <div className="space-y-3 mb-4">
                {team.city && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{team.city}, {team.country || 'India'}</span>
                  </div>
                )}
                {team.homeGround && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Trophy size={14} className="text-gray-400" />
                    <span>{team.homeGround}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={14} className="text-gray-400" />
                  <span>{team.players?.length || 0} Players</span>
                </div>
                {team.stats && (
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Award size={14} className="text-green-500" />
                      {team.stats.matchesWon} Wins
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-blue-500" />
                      {team.stats.matchesPlayed} Played
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <Link
                  to={`/teams/${team._id}`}
                  className="flex-1 btn-secondary text-center text-sm py-2 flex items-center justify-center gap-1"
                >
                  <Eye size={14} />
                  View
                </Link>
                {!team.isVerified && team.isActive && (
                  <button
                    onClick={() => handleVerify(team._id)}
                    className="flex-1 btn-primary text-center text-sm py-2 flex items-center justify-center gap-1"
                  >
                    <CheckCircle size={14} />
                    Verify
                  </button>
                )}
                <button
                  onClick={() => handleDelete(team._id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} teams
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

export default TeamsList
