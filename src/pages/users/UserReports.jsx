import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, Search, Filter, MoreVertical, 
  CheckCircle, XCircle, Mail, Phone, Calendar,
  Shield, ChevronRight, UserCheck, BadgeCheck,
  Flag, AlertTriangle, Ban, Check, X, Clock
} from 'lucide-react'
import { userService } from '../../services/user.service'
import toast from 'react-hot-toast'

const UserReports = () => {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedReport, setSelectedReport] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  })

  useEffect(() => {
    fetchReports()
  }, [pagination.page, filter])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filter !== 'all' && { status: filter })
      }
      
      const response = await userService.getUserReports(params)
      setReports(response.data?.reports || [])
      setPagination(prev => ({
        ...prev,
        total: response.data?.pagination?.total || 0
      }))
    } catch (error) {
      console.error('Error fetching reports:', error)
      // Mock data for demo
      setReports([
        { 
          _id: '1', 
          reporter: { fullName: 'John Doe', email: 'john@example.com' },
          reportedUser: { fullName: 'Fake User', email: 'fake@example.com' },
          reason: 'Spam',
          description: 'This user is sending spam messages',
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        { 
          _id: '2', 
          reporter: { fullName: 'Jane Smith', email: 'jane@example.com' },
          reportedUser: { fullName: 'Bad Player', email: 'bad@example.com' },
          reason: 'Harassment',
          description: 'This user is harassing other players',
          status: 'pending',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (reportId, action) => {
    const adminNote = action === 'ban' 
      ? 'Action taken: User banned due to violation'
      : 'Report dismissed after review'
    
    try {
      setActionLoading(true)
      await userService.actionOnReport(reportId, action, adminNote)
      toast.success(`Report ${action === 'ban' ? 'approved - user banned' : 'rejected'}`)
      fetchReports()
      setShowModal(false)
    } catch (error) {
      console.error('Error taking action:', error)
      toast.error('Failed to take action on report')
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getReasonIcon = (reason) => {
    switch (reason?.toLowerCase()) {
      case 'spam':
        return <Flag size={16} className="text-orange-500" />
      case 'harassment':
        return <AlertTriangle size={16} className="text-red-500" />
      case 'fake profile':
        return <UserCheck size={16} className="text-purple-500" />
      default:
        return <Flag size={16} className="text-gray-500" />
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Reports</h1>
          <p className="text-gray-500 mt-1">Manage and review user reports</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary inline-flex items-center gap-2">
            <Shield size={18} />
            Export Reports
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Ban className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Users Banned</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
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
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Reporter</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Reported User</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Reason</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Description</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                  </tr>
                ))
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    <Flag size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No reports found</p>
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                          {report.reporter?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{report.reporter?.fullName || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{report.reporter?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-medium text-sm">
                          {report.reportedUser?.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{report.reportedUser?.fullName || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{report.reportedUser?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getReasonIcon(report.reason)}
                        <span className="text-sm text-gray-700">{report.reason}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600 max-w-xs truncate">
                        {report.description}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(report.status)}`}>
                        {report.status?.charAt(0).toUpperCase() + report.status?.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      {report.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedReport(report)
                              setShowModal(true)
                            }}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Review"
                          >
                            <Shield size={18} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
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
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
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
                disabled={pagination.page * pagination.limit >= pagination.total}
                className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Review Report</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Reported by</p>
                <p className="font-medium">{selectedReport.reporter?.fullName}</p>
                <p className="text-sm text-gray-500">{selectedReport.reporter?.email}</p>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Reported User</p>
                <p className="font-medium">{selectedReport.reportedUser?.fullName}</p>
                <p className="text-sm text-gray-500">{selectedReport.reportedUser?.email}</p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Reason</p>
                <p className="font-medium">{selectedReport.reason}</p>
                <p className="text-sm text-gray-600 mt-2">{selectedReport.description}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => handleAction(selectedReport._id, 'reject')}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
              >
                <X size={18} />
                Dismiss Report
              </button>
              <button 
                onClick={() => handleAction(selectedReport._id, 'ban')}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <Ban size={18} />
                Ban User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserReports

