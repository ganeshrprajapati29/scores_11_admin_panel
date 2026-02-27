import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, Plus, Users, Mail, Phone, MapPin, 
  Calendar, Shield, MoreVertical, Trash2, Edit, 
  Eye, CheckCircle, XCircle, Filter, Award,
  User, Star, Activity, Trophy, Download
} from 'lucide-react'
import { usersAPI } from '../../services/api'
import toast from 'react-hot-toast'

const UsersList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    level: '',
    playerType: '',
    isActive: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [pagination.page, pagination.limit, filters])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.search && { search: filters.search }),
        ...(filters.role && { role: filters.role }),
        ...(filters.level && { level: filters.level }),
        ...(filters.playerType && { playerType: filters.playerType }),
        ...(filters.isActive && { isActive: filters.isActive === 'true' })
      }
      
      const response = await usersAPI.getAll(params)
      
      // Handle different response structures
      const usersData = response.data?.users || response.data || response.users || []
      const paginationData = response.data?.pagination || response.pagination || {}
      
      setUsers(usersData)
      setPagination(prev => ({
        ...prev,
        total: paginationData.total || usersData.length || 0,
        pages: paginationData.pages || Math.ceil((paginationData.total || usersData.length) / pagination.limit) || 1
      }))
    } catch (error) {
      console.error('Fetch users error:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchUsers()
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    
    try {
      await usersAPI.delete(id)
      toast.success('User deleted successfully')
      fetchUsers()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete user')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      toast.error('No users selected')
      return
    }
    
    if (!window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) return
    
    try {
      // API should support bulk delete
      await Promise.all(selectedUsers.map(id => usersAPI.delete(id)))
      toast.success(`${selectedUsers.length} users deleted successfully`)
      setSelectedUsers([])
      setSelectAll(false)
      fetchUsers()
    } catch (error) {
      console.error('Bulk delete error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete users')
    }
  }

  const handleStatusToggle = async (user) => {
    try {
      await usersAPI.update(user._id, { isActive: !user.isActive })
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`)
      fetchUsers()
    } catch (error) {
      console.error('Status toggle error:', error)
      toast.error(error.response?.data?.message || 'Failed to update status')
    }
  }

  const handleExport = async () => {
    try {
      setExportLoading(true)
      // API should support export
      const response = await usersAPI.export(filters)
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      toast.success('Users exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error(error.response?.data?.message || 'Failed to export users')
    } finally {
      setExportLoading(false)
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map(u => u._id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectUser = (id) => {
    setSelectedUsers(prev => {
      if (prev.includes(id)) {
        return prev.filter(userId => userId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'player': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'captain': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'manager': return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      case 'user': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusBadgeColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-700 border-green-200' 
      : 'bg-red-100 text-red-700 border-red-200'
  }

  const getLevelBadge = (level) => {
    const levels = {
      1: { label: 'Beginner', color: 'bg-green-100 text-green-700' },
      2: { label: 'Intermediate', color: 'bg-blue-100 text-blue-700' },
      3: { label: 'Advanced', color: 'bg-orange-100 text-orange-700' },
      4: { label: 'Expert', color: 'bg-purple-100 text-purple-700' },
      5: { label: 'Professional', color: 'bg-red-100 text-red-700' }
    }
    return levels[level] || { label: 'Beginner', color: 'bg-gray-100 text-gray-700' }
  }

  const getPlayerTypeIcon = (type) => {
    switch (type) {
      case 'batsman': return '🏏'
      case 'bowler': return '🎯'
      case 'all-rounder': return '⚡'
      case 'wicket-keeper': return '🧤'
      default: return '👤'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-500 mt-1">Manage all registered users in the system</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={exportLoading || users.length === 0}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Download size={18} />
            {exportLoading ? 'Exporting...' : 'Export'}
          </button>
          <Link to="/admin/users/create" className="btn-primary inline-flex items-center gap-2">
            <Plus size={18} />
            Add New User
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
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
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Inactive</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => !u.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Level</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.length ? (users.reduce((acc, u) => acc + (u.level || 1), 0) / users.length).toFixed(1) : 0}
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
              placeholder="Search by name, email, username, or phone..."
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
            {(filters.role || filters.level || filters.playerType || filters.isActive) && (
              <span className="ml-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs">
                Active
              </span>
            )}
          </button>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={filters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="input w-full"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="player">Player</option>
                  <option value="captain">Captain</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select
                  value={filters.level}
                  onChange={(e) => handleFilterChange('level', e.target.value)}
                  className="input w-full"
                >
                  <option value="">All Levels</option>
                  <option value="1">Beginner (Level 1)</option>
                  <option value="2">Intermediate (Level 2)</option>
                  <option value="3">Advanced (Level 3)</option>
                  <option value="4">Expert (Level 4)</option>
                  <option value="5">Professional (Level 5)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Player Type</label>
                <select
                  value={filters.playerType}
                  onChange={(e) => handleFilterChange('playerType', e.target.value)}
                  className="input w-full"
                >
                  <option value="">All Types</option>
                  <option value="batsman">Batsman</option>
                  <option value="bowler">Bowler</option>
                  <option value="all-rounder">All-rounder</option>
                  <option value="wicket-keeper">Wicket-keeper</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.isActive}
                  onChange={(e) => handleFilterChange('isActive', e.target.value)}
                  className="input w-full"
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="input w-full"
                >
                  <option value="createdAt">Joined Date</option>
                  <option value="fullName">Name</option>
                  <option value="experiencePoints">Experience</option>
                  <option value="level">Level</option>
                  <option value="lastLogin">Last Login</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="input w-full"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{selectedUsers.length}</span> users selected
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium inline-flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete Selected
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No users found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                    />
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">User</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Contact</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Role</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Level & Type</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Joined</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => {
                  const levelBadge = getLevelBadge(user.level)
                  return (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleSelectUser(user._id)}
                          className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold text-sm overflow-hidden flex-shrink-0">
                            {user.avatar?.url ? (
                              <img 
                                src={user.avatar.url} 
                                alt={user.fullName || user.name} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              (user.fullName || user.name || 'U').charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.fullName || user.name || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-500">
                              @{user.username || 'username'} • {user.experiencePoints || 0} XP
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} className="text-gray-400 flex-shrink-0" />
                            <span className="truncate max-w-[150px]">{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Phone size={14} className="text-gray-400 flex-shrink-0" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-2">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${levelBadge.color}`}>
                            {levelBadge.label} (Lvl {user.level || 1})
                          </span>
                          {user.cricketProfile?.playerType && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <span>{getPlayerTypeIcon(user.cricketProfile.playerType)}</span>
                              <span className="capitalize">{user.cricketProfile.playerType}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-2">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(user.isActive)}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {user.isEmailVerified && (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle size={12} />
                              Email Verified
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar size={14} className="text-gray-400" />
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }) : 'N/A'}
                          </div>
                          {user.lastLogin && (
                            <div className="text-xs text-gray-400">
                              Last: {new Date(user.lastLogin).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/admin/users/${user._id}`}
                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            to={`/admin/users/${user._id}/edit`}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleStatusToggle(user)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.isActive 
                                ? 'text-gray-500 hover:text-red-600 hover:bg-red-50' 
                                : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                            }`}
                            title={user.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {user.isActive ? <XCircle size={18} /> : <CheckCircle size={18} />}
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                let pageNum
                if (pagination.pages <= 5) {
                  pageNum = i + 1
                } else if (pagination.page <= 3) {
                  pageNum = i + 1
                } else if (pagination.page >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i
                } else {
                  pageNum = pagination.page - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      pagination.page === pageNum
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersList