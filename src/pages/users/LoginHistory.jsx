import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Users, Search, Filter, MoreVertical, 
  CheckCircle, XCircle, Mail, Phone, Calendar,
  Shield, ChevronRight, UserCheck, BadgeCheck,
  Clock, MapPin, Monitor, Smartphone, Globe
} from 'lucide-react'
import { userService } from '../../services/user.service'
import toast from 'react-hot-toast'

const LoginHistory = () => {
  const { userId } = useParams()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    if (userId) {
      fetchLoginHistory()
    }
  }, [userId, pagination.page])

  const fetchLoginHistory = async () => {
    try {
      setLoading(true)
      const response = await userService.getLoginHistory(userId, {
        page: pagination.page,
        limit: pagination.limit
      })
      
      setHistory(response.data || [])
      
      // If user info is in response
      if (response.data?.user) {
        setUser(response.data.user)
      }
    } catch (error) {
      console.error('Error fetching login history:', error)
      toast.error('Failed to fetch login history')
      // Mock data for demo
      setHistory([
        { _id: '1', ipAddress: '192.168.1.1', deviceInfo: 'Chrome on Windows', location: 'Mumbai, India', loginAt: new Date().toISOString() },
        { _id: '2', ipAddress: '10.0.0.1', deviceInfo: 'Safari on iPhone', location: 'Delhi, India', loginAt: new Date(Date.now() - 86400000).toISOString() },
        { _id: '3', ipAddress: '172.16.0.1', deviceInfo: 'Firefox on MacOS', location: 'Bangalore, India', loginAt: new Date(Date.now() - 172800000).toISOString() },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getDeviceIcon = (deviceInfo) => {
    if (deviceInfo?.toLowerCase().includes('iphone') || deviceInfo?.toLowerCase().includes('android')) {
      return <Smartphone size={18} className="text-blue-600" />
    }
    return <Monitor size={18} className="text-gray-600" />
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeAgo = (date) => {
    const now = new Date()
    const loginDate = new Date(date)
    const diff = now - loginDate
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 60) return `${minutes} minutes ago`
    if (hours < 24) return `${hours} hours ago`
    return `${days} days ago`
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Login History</h1>
          <p className="text-gray-500 mt-1">Track user login activities and sessions</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to={`/users/${userId}`} 
            className="btn-secondary inline-flex items-center gap-2"
          >
            <ChevronRight size={18} className="rotate-180" />
            Back to User
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Logins</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total || history.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Mobile Logins</p>
              <p className="text-2xl font-bold text-gray-900">
                {history.filter(h => h.deviceInfo?.toLowerCase().includes('iphone') || h.deviceInfo?.toLowerCase().includes('android')).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Monitor className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Desktop Logins</p>
              <p className="text-2xl font-bold text-gray-900">
                {history.filter(h => h.deviceInfo?.toLowerCase().includes('chrome') || h.deviceInfo?.toLowerCase().includes('firefox') || h.deviceInfo?.toLowerCase().includes('safari')).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Locations</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(history.map(h => h.location)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">#</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Date & Time</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Device</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">IP Address</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Location</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Time Ago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  </tr>
                ))
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    <Clock size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No login history found</p>
                  </td>
                </tr>
              ) : (
                history.map((entry, index) => (
                  <tr key={entry._id || index} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-900">
                        <Calendar size={16} className="text-gray-400" />
                        {formatDate(entry.loginAt)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(entry.deviceInfo)}
                        <span className="text-sm text-gray-600">{entry.deviceInfo || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield size={14} className="text-gray-400" />
                        {entry.ipAddress || 'N/A'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="text-gray-400" />
                        {entry.location || 'Unknown'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-500">
                        {getTimeAgo(entry.loginAt)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginHistory

