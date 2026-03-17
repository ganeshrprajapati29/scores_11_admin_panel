import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, Plus, Users, Mail, Phone, Trophy,
  Trash2, Edit, Eye, RefreshCw
} from 'lucide-react'
import { playersAPI } from '../../services/api'
import toast from 'react-hot-toast'

const PlayersList = () => {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter })
      }
      const response = await playersAPI.getAll(params)
      setPlayers(response.data || [])
      if (response.pagination) {
        setPagination(prev => ({ ...prev, ...response.pagination }))
      }
    } catch (error) {
      toast.error('Failed to fetch players')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, search, statusFilter])

  useEffect(() => {
    fetchPlayers()
  }, [fetchPlayers])

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this player?')) return
    try {
      await playersAPI.delete(id)
      toast.success('Player deleted successfully')
      fetchPlayers()
    } catch (error) {
      toast.error(error.message || 'Failed to delete player')
    }
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const getEmail = (player) => player.user?.email || player.email || 'N/A'
  const getPhone = (player) => player.user?.phone || player.phone || 'N/A'

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Players Management</h1>
          <p className="text-gray-500 mt-1">Manage all registered players in the system</p>
        </div>
        <Link to="/players/create" className="btn-primary inline-flex items-center gap-2">
          <Plus size={18} />
          Add New Player
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
              <p className="text-sm text-gray-500">Total Players</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Players</p>
              <p className="text-2xl font-bold text-gray-900">
                {players.filter(p => p.isActive).length}
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
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-40"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button type="submit" className="btn-primary px-6">
            Search
          </button>
          <button type="button" onClick={fetchPlayers} className="btn-secondary inline-flex items-center gap-2">
            <RefreshCw size={18} />
            Refresh
          </button>
        </form>
      </div>

      {/* Players Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading players...</p>
          </div>
        ) : players.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No players found</p>
            <p className="text-gray-400 mt-1">{search ? 'Try adjusting your search' : 'Get started by adding a player'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Player</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Contact</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Role</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Team</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {players.map((player) => (
                  <tr key={player._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                          {player.avatar?.url ? (
                            <img src={player.avatar.url} alt={player.name} className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            (player.playerName || player.user?.name || 'P').charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {player.playerName || player.user?.name || 'Unknown Player'}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">ID: {player._id?.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} className="text-gray-400 flex-shrink-0" />
                          <span className="truncate">{getEmail(player)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Phone size={14} className="text-gray-400 flex-shrink-0" />
                          <span>{getPhone(player)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 capitalize">
                        {player.role || 'Batsman'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-medium text-gray-900">{player.team?.name || 'Not Assigned'}</p>
                      {player.team?.shortName && (
                        <p className="text-xs text-gray-500">{player.team.shortName}</p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                        player.isActive 
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {player.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/players/${player._id}/details`}
                          className="p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/players/${player._id}/edit`}
                          className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(player._id)}
                          className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {Math.min(((pagination.page - 1) * pagination.limit) + 1, pagination.total)} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} players
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PlayersList

