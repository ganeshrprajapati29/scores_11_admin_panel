import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, AlertTriangle, CheckCircle, XCircle, Flag,
  User, MessageSquare, Image, Video, FileText, MoreVertical
} from 'lucide-react'

const ReportedContent = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState(null)

  useEffect(() => {
    // Mock data for reported content
    setReports([
      { 
        id: 1, 
        type: 'post', 
        content: 'Inappropriate behavior during match...', 
        reporter: 'User123',
        reportedUser: 'User456',
        reason: 'Harassment',
        status: 'pending',
        date: '2024-01-15'
      },
      { 
        id: 2, 
        type: 'comment', 
        content: 'Spam content in forum...', 
        reporter: 'User789',
        reportedUser: 'User101',
        reason: 'Spam',
        status: 'resolved',
        date: '2024-01-14'
      },
      { 
        id: 3, 
        type: 'profile', 
        content: 'Fake profile information...', 
        reporter: 'User112',
        reportedUser: 'User131',
        reason: 'Fake Account',
        status: 'pending',
        date: '2024-01-13'
      },
    ])
    setLoading(false)
  }, [])

  const handleResolve = (reportId, action) => {
    setReports(reports.map(r => 
      r.id === reportId ? { ...r, status: action } : r
    ))
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'post': return MessageSquare
      case 'comment': return FileText
      case 'profile': return User
      case 'image': return Image
      case 'video': return Video
      default: return Flag
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/moderation')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reported Content</h1>
            <p className="text-gray-500">Review and take action on reported content</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            {reports.filter(r => r.status === 'pending').length} Pending
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            {reports.filter(r => r.status === 'resolved').length} Resolved
          </span>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {reports.map((report) => {
            const TypeIcon = getTypeIcon(report.type)
            return (
              <div key={report.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <TypeIcon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium uppercase">
                          {report.type}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          report.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-gray-900 mb-2">{report.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Reported by: {report.reporter}</span>
                        <span>User: {report.reportedUser}</span>
                        <span>Reason: {report.reason}</span>
                        <span>Date: {report.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleResolve(report.id, 'resolved')}
                          className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Resolve
                        </button>
                        <button
                          onClick={() => handleResolve(report.id, 'dismissed')}
                          className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <XCircle className="w-4 h-4" />
                          Dismiss
                        </button>
                      </>
                    )}
                    <Link
                      to={`/admin/moderation/reported/${report.id}/action`}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {reports.length === 0 && (
        <div className="text-center py-12">
          <Flag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">No Reported Content</h3>
          <p className="text-gray-500">All reported content has been reviewed</p>
        </div>
      )}
    </div>
  )
}

export default ReportedContent

