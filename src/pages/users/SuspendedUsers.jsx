import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, Search, Filter, MoreVertical, 
  CheckCircle, XCircle, Mail, Phone, Calendar,
  Shield, ChevronRight, UserX, Ban
} from 'lucide-react'
import { userAPI } from '../../services/api'

const SuspendedUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  })

  useEffect(() => {
    fetchSuspendedUsers()
  }, [pagination.page, filter])

  const fetchSuspendedUsers = async () => {
    try {
      setLoading(true)
      const response = await userAPI.getAllUsers({
        page: pagination.page,
        limit: pagination.limit,
        status: 'suspended'
      })
      setUsers(response.data.users || [])
    } catch (error) {
      console.error('Error fetching suspended users:', error)
      // Mock data
      setUsers([
        { _id: '1', name: 'John Doe', email: 'john@example.com', phone: '+91 98765 43210', role: 'user', isActive: false, suspendReason: 'Spam content', suspendedAt: '2024-01-20', avatar: null },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+91 98765 43211', role: 'player', isActive: false, suspendReason: 'Violated terms', suspendedAt: '2024-01-18', avatar: null },
        { _id: '3', name: 'Bob Wilson', email: 'bob@example.com', phone: '+91 98765 43212', role: 'user', isActive: false, suspendReason: 'Fake account', suspendedAt: '2024-01-15', avatar: null },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleUnsuspend = async (userId) => {
    try {
      await userAPI.updateUser(userId, { isActive: true })
      fetchSuspendedUsers()
    } catch (error) {
      console.error('Error unsuspening user:', error)
    }
  }

  const handleDelete = async (userId) => {
    try {
      await userAPI.deleteUser(userId)
      fetchSuspendedUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suspended Users</h1>
          <p className="text-gray-500 mt-1">Manage suspended and banned user accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <UserX size={18} />
            Export List
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <UserX className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-sm text-gray-500">Total Suspended</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Ban className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.suspendReason?.includes('Spam')).length}</p>
              <p className="text-sm text-gray-500">Spam</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.suspendReason?.includes('Violated')).length}</p>
              <p className="text-sm text-gray-500">Violations</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <XCircle className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.suspendReason?.includes('Fake')).length}</p>
              <p className="text-sm text-gray-500">Fake Accounts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Reasons</option>
              <option value="spam">Spam</option>
              <option value="violation">Violations</option>
              <option value="fake">Fake Account</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Suspended On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <UserX size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No suspended users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{user.suspendReason || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">
                        {user.suspendedAt ? new Date(user.suspendedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-sm text-red-600">
                        <XCircle size={16} />
                        Suspended
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setSelectedUser(user)
                            setShowModal(true)
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-6">User Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => {
                  handleUnsuspend(selectedUser._id)
                  setShowModal(false)
                }}
                className="w-full px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-left flex items-center gap-3"
              >
                <CheckCircle size={20} />
                Unsuspend User
              </button>
              <button className="w-full px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-left flex items-center gap-3">
                <Calendar size={20} />
                View Activity Log
              </button>
              <button 
                onClick={() => {
                  handleDelete(selectedUser._id)
                  setShowModal(false)
                }}
                className="w-full px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-left flex items-center gap-3"
              >
                <XCircle size={20} />
                Permanently Delete
              </button>
            </div>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full mt-4 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SuspendedUsers
