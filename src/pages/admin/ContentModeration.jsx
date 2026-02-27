import { useState, useEffect } from 'react'
import { 
  Shield, CheckCircle, XCircle, Eye, Flag, 
  MessageSquare, Image, FileText, User,
  Filter, Search, RefreshCw, AlertTriangle
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Modal } from '../../components/common/Modal'
import { Table } from '../../components/common/Table'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { Loader } from '../../components/common/Loader'
import { Pagination } from '../../components/common/Pagination'
import { adminService } from '../../services/admin.service'
import { toast } from 'react-hot-toast'
import { formatDate } from '../../utils/formatDate'

const ContentModeration = () => {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('pending')
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedContent, setSelectedContent] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [actionType, setActionType] = useState('')
  const [actionReason, setActionReason] = useState('')

  const contentTypes = [
    { id: 'all', name: 'All Types', icon: Shield },
    { id: 'post', name: 'Posts', icon: MessageSquare },
    { id: 'comment', name: 'Comments', icon: MessageSquare },
    { id: 'image', name: 'Images', icon: Image },
    { id: 'blog', name: 'Blogs', icon: FileText },
  ]

  const actionReasons = [
    'Spam',
    'Inappropriate content',
    'Harassment',
    'Misinformation',
    'Copyright violation',
    'Other'
  ]

  useEffect(() => {
    fetchContent()
  }, [currentPage, filterStatus, filterType])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await adminService.getModerationQueue({
        page: currentPage,
        status: filterStatus,
        type: filterType !== 'all' ? filterType : undefined,
        search: searchQuery || undefined
      })
      setContent(response.data?.content || [])
      setTotalPages(response.data?.pagination?.totalPages || 1)
    } catch (error) {
      toast.error('Failed to fetch content')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    try {
      await adminService.moderateContent(selectedContent._id, {
        action: 'approve',
        reason: actionReason
      })
      toast.success('Content approved')
      setIsActionModalOpen(false)
      setSelectedContent(null)
      setActionReason('')
      fetchContent()
    } catch (error) {
      toast.error('Failed to approve content')
    }
  }

  const handleReject = async () => {
    try {
      await adminService.moderateContent(selectedContent._id, {
        action: 'reject',
        reason: actionReason
      })
      toast.success('Content rejected')
      setIsActionModalOpen(false)
      setSelectedContent(null)
      setActionReason('')
      fetchContent()
    } catch (error) {
      toast.error('Failed to reject content')
    }
  }

  const handleDelete = async () => {
    try {
      await adminService.deleteContent(selectedContent._id)
      toast.success('Content deleted')
      setIsActionModalOpen(false)
      setSelectedContent(null)
      fetchContent()
    } catch (error) {
      toast.error('Failed to delete content')
    }
  }

  const openActionModal = (item, action) => {
    setSelectedContent(item)
    setActionType(action)
    setIsActionModalOpen(true)
  }

  const openPreview = (item) => {
    setSelectedContent(item)
    setIsPreviewOpen(true)
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      flagged: 'bg-orange-100 text-orange-700'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const columns = [
    { key: 'content', title: 'Content', render: (item) => (
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          {item.type === 'image' ? (
            <Image className="w-5 h-5 text-gray-500" />
          ) : (
            <FileText className="w-5 h-5 text-gray-500" />
          )}
        </div>
        <div className="max-w-xs">
          <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.title || item.content}</p>
          <p className="text-xs text-gray-500 mt-1 capitalize">{item.type}</p>
        </div>
      </div>
    )},
    { key: 'author', title: 'Author', render: (item) => (
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-gray-400" />
        <span className="text-sm">{item.author?.name || 'Unknown'}</span>
      </div>
    )},
    { key: 'reports', title: 'Reports', render: (item) => (
      <div className="flex items-center gap-1">
        <Flag className="w-4 h-4 text-red-500" />
        <span className="text-sm font-medium text-red-600">{item.reportCount || 0}</span>
      </div>
    )},
    { key: 'status', title: 'Status', render: (item) => getStatusBadge(item.status) },
    { key: 'submitted', title: 'Submitted', render: (item) => (
      <span className="text-sm text-gray-600">
        {formatDate(item.createdAt, 'MMM DD, HH:mm')}
      </span>
    )},
    { key: 'actions', title: 'Actions', render: (item) => (
      <div className="flex items-center gap-1">
        <button
          onClick={() => openPreview(item)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Preview"
        >
          <Eye className="w-4 h-4" />
        </button>
        {item.status === 'pending' && (
          <>
            <button
              onClick={() => openActionModal(item, 'approve')}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Approve"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => openActionModal(item, 'reject')}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Reject"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </>
        )}
        <button
          onClick={() => openActionModal(item, 'delete')}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <AlertTriangle className="w-4 h-4" />
        </button>
      </div>
    )},
  ]

  if (loading) return <Loader />

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Moderation</h1>
          <p className="text-gray-600 mt-1">Review and moderate user-generated content</p>
        </div>
        <Button 
          variant="secondary" 
          onClick={fetchContent}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending Review', value: content.filter(c => c.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'Approved Today', value: content.filter(c => c.status === 'approved').length, color: 'bg-green-500' },
          { label: 'Flagged', value: content.filter(c => c.status === 'flagged').length, color: 'bg-orange-500' },
          { label: 'Total Reports', value: content.reduce((acc, c) => acc + (c.reportCount || 0), 0), color: 'bg-red-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className={`w-3 h-3 rounded-full ${stat.color} mb-2`} />
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="flagged">Flagged</option>
            <option value="all">All Status</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {contentTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table
          columns={columns}
          data={content}
          emptyMessage="No content to moderate"
        />
        {content.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Content Preview"
        size="lg"
      >
        {selectedContent && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="font-medium">{selectedContent.author?.name}</span>
              </div>
              <span className="text-sm text-gray-500">
                {formatDate(selectedContent.createdAt, 'MMM DD, YYYY HH:mm')}
              </span>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">{selectedContent.title}</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{selectedContent.content}</p>
              {selectedContent.imageUrl && (
                <img 
                  src={selectedContent.imageUrl} 
                  alt="Content" 
                  className="mt-4 max-h-64 rounded-lg"
                />
              )}
            </div>

            {selectedContent.reports?.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Reports ({selectedContent.reports.length})
                </h4>
                <ul className="space-y-2">
                  {selectedContent.reports.map((report, idx) => (
                    <li key={idx} className="text-sm text-red-700">
                      • {report.reason} - {report.reporter?.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Action Modal */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title={`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} Content`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            You are about to <strong>{actionType}</strong> this content. 
            {actionType !== 'delete' && ' Please provide a reason:'}
          </p>
          
          {actionType !== 'delete' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason {actionType === 'reject' && '*'}
              </label>
              <select
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-3"
                required={actionType === 'reject'}
              >
                <option value="">Select a reason...</option>
                {actionReasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Or enter custom reason..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />
            </div>
          )}

          {actionType === 'delete' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">
                <strong>Warning:</strong> This action cannot be undone. The content will be permanently deleted.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsActionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (actionType === 'approve') handleApprove()
                else if (actionType === 'reject') handleReject()
                else if (actionType === 'delete') handleDelete()
              }}
              variant={actionType === 'delete' ? 'danger' : 'primary'}
            >
              Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ContentModeration
