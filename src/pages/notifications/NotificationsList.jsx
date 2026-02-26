import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Bell, Search, Plus, Trash2, Eye, Check, CheckCheck,
  RefreshCw, Filter, Send, User, Users
} from 'lucide-react'
import { notificationService } from '../../services/notification.service'
import toast from 'react-hot-toast'

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [showSendModal, setShowSendModal] = useState(false)
  const [sendData, setSendData] = useState({ type: 'all', title: '', message: '', userId: '' })

  useEffect(() => {
    fetchNotifications()
  }, [pagination.page, pagination.limit, typeFilter])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(typeFilter && { type: typeFilter })
      }
      const response = await notificationService.getAll(params)
      setNotifications(response.data || [])
      if (response.pagination) {
        setPagination(prev => ({ ...prev, ...response.pagination }))
      }
    } catch (error) {
      toast.error('Failed to fetch notifications')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchNotifications()
  }

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      toast.success('Notification marked as read')
      fetchNotifications()
    } catch (error) {
      toast.error(error.message || 'Failed to mark as read')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      toast.success('All notifications marked as read')
      fetchNotifications()
    } catch (error) {
      toast.error(error.message || 'Failed to mark all as read')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return
    try {
      await notificationService.delete(id)
      toast.success('Notification deleted successfully')
      fetchNotifications()
    } catch (error) {
      toast.error(error.message || 'Failed to delete notification')
    }
  }

  const handleSendNotification = async (e) => {
    e.preventDefault()
    try {
      if (sendData.type === 'all') {
        await notificationService.sendToAll({ title: sendData.title, message: sendData.message })
      } else {
        await notificationService.sendToUser(sendData.userId, { title: sendData.title, message: sendData.message })
      }
      toast.success('Notification sent successfully')
      setShowSendModal(false)
      setSendData({ type: 'all', title: '', message: '', userId: '' })
      fetchNotifications()
    } catch (error) {
      toast.error(error.message || 'Failed to send notification')
    }
  }

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'match': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'tournament': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'wallet': return 'bg-green-100 text-green-700 border-green-200'
      case 'system': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications Management</h1>
          <p className="text-gray-500 mt-1">Send and manage system notifications</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleMarkAllAsRead} className="btn-secondary inline-flex items-center gap-2">
            <CheckCheck size={18} />
            Mark All Read
          </button>
          <button onClick={() => setShowSendModal(true)} className="btn-primary inline-flex items-center gap-2">
            <Send size={18} />
            Send Notification
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Read</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => n.read).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Unread</p>
              <p className="text-2xl font-bold text-gray-900">
                {notifications.filter(n => !n.read).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input w-40"
            >
              <option value="">All Types</option>
              <option value="match">Match</option>
              <option value="tournament">Tournament</option>
              <option value="wallet">Wallet</option>
              <option value="system">System</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
          <button type="button" onClick={fetchNotifications} className="btn-secondary inline-flex items-center gap-2">
            <RefreshCw size={18} />
            Refresh
          </button>
        </form>
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No notifications found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div 
                key={notification._id} 
                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    notification.read ? 'bg-gray-100' : 'bg-primary-100'
                  }`}>
                    <Bell size={18} className={notification.read ? 'text-gray-600' : 'text-primary-600'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getTypeBadgeColor(notification.type)}`}>
                        {notification.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {notification.user && (
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {notification.user.name}
                        </span>
                      )}
                      <span>
                        {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
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

      {/* Send Notification Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Send Notification</h3>
            <form onSubmit={handleSendNotification}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Send To</label>
                  <select
                    value={sendData.type}
                    onChange={(e) => setSendData({ ...sendData, type: e.target.value })}
                    className="input w-full"
                  >
                    <option value="all">All Users</option>
                    <option value="specific">Specific User</option>
                  </select>
                </div>
                {sendData.type === 'specific' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                    <input
                      type="text"
                      value={sendData.userId}
                      onChange={(e) => setSendData({ ...sendData, userId: e.target.value })}
                      className="input w-full"
                      placeholder="Enter user ID"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={sendData.title}
                    onChange={(e) => setSendData({ ...sendData, title: e.target.value })}
                    className="input w-full"
                    placeholder="Enter title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    value={sendData.message}
                    onChange={(e) => setSendData({ ...sendData, message: e.target.value })}
                    className="input w-full"
                    placeholder="Enter message"
                    rows="3"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationsList
