import { useState, useEffect } from 'react'
import { 
  Shield, CheckCircle, XCircle, Clock, User,
  FileText, Image, Search, Filter, Eye,
  Download, MoreHorizontal, AlertTriangle
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

const UserVerifications = () => {
  const [verifications, setVerifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('pending')
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedVerification, setSelectedVerification] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [actionType, setActionType] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  const verificationTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'kyc', name: 'KYC Verification' },
    { id: 'identity', name: 'Identity Verification' },
    { id: 'address', name: 'Address Verification' },
    { id: 'payment', name: 'Payment Method' },
  ]

  const rejectionReasons = [
    'Document unclear or illegible',
    'Document expired',
    'Information mismatch',
    'Invalid document type',
    'Suspicious activity detected',
    'Other'
  ]

  useEffect(() => {
    fetchVerifications()
  }, [currentPage, filterStatus, filterType])

  const fetchVerifications = async () => {
    try {
      setLoading(true)
      const response = await adminService.getVerifications({
        page: currentPage,
        status: filterStatus,
        type: filterType !== 'all' ? filterType : undefined,
        search: searchQuery || undefined
      })
      setVerifications(response.data?.verifications || [])
      setTotalPages(response.data?.pagination?.totalPages || 1)
    } catch (error) {
      toast.error('Failed to fetch verifications')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    try {
      await adminService.approveVerification(selectedVerification._id, {
        notes: rejectionReason
      })
      toast.success('Verification approved')
      setIsActionModalOpen(false)
      setSelectedVerification(null)
      setRejectionReason('')
      fetchVerifications()
    } catch (error) {
      toast.error('Failed to approve verification')
    }
  }

  const handleReject = async () => {
    try {
      await adminService.rejectVerification(selectedVerification._id, {
        reason: rejectionReason
      })
      toast.success('Verification rejected')
      setIsActionModalOpen(false)
      setSelectedVerification(null)
      setRejectionReason('')
      fetchVerifications()
    } catch (error) {
      toast.error('Failed to reject verification')
    }
  }

  const openDetailModal = (verification) => {
    setSelectedVerification(verification)
    setIsDetailOpen(true)
  }

  const openActionModal = (verification, action) => {
    setSelectedVerification(verification)
    setActionType(action)
    setIsActionModalOpen(true)
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      under_review: 'bg-blue-100 text-blue-700'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    )
  }

  const columns = [
    { key: 'user', title: 'User', render: (v) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{v.user?.name}</p>
          <p className="text-sm text-gray-500">{v.user?.email}</p>
        </div>
      </div>
    )},
    { key: 'type', title: 'Type', render: (v) => (
      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs capitalize">
        {v.type.replace('_', ' ')}
      </span>
    )},
    { key: 'documents', title: 'Documents', render: (v) => (
      <div className="flex items-center gap-1">
        <FileText className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600">{v.documents?.length || 0} files</span>
      </div>
    )},
    { key: 'status', title: 'Status', render: (v) => getStatusBadge(v.status) },
    { key: 'submitted', title: 'Submitted', render: (v) => (
      <span className="text-sm text-gray-600">
        {formatDate(v.createdAt, 'MMM DD, YYYY')}
      </span>
    )},
    { key: 'actions', title: 'Actions', render: (v) => (
      <div className="flex items-center gap-1">
        <button
          onClick={() => openDetailModal(v)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
        {v.status === 'pending' && (
          <>
            <button
              onClick={() => openActionModal(v, 'approve')}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Approve"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => openActionModal(v, 'reject')}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Reject"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    )},
  ]

  if (loading) return <Loader />

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Verifications</h1>
          <p className="text-gray-600 mt-1">Review and process KYC and identity verifications</p>
        </div>
        <Button variant="secondary" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending', value: verifications.filter(v => v.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'Approved', value: verifications.filter(v => v.status === 'approved').length, color: 'bg-green-500' },
          { label: 'Rejected', value: verifications.filter(v => v.status === 'rejected').length, color: 'bg-red-500' },
          { label: 'Under Review', value: verifications.filter(v => v.status === 'under_review').length, color: 'bg-blue-500' },
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
              placeholder="Search by user name or email..."
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
            <option value="under_review">Under Review</option>
            <option value="all">All Status</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {verificationTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Verifications Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table
          columns={columns}
          data={verifications}
          emptyMessage="No verifications found"
        />
        {verifications.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Verification Details"
        size="lg"
      >
        {selectedVerification && (
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedVerification.user?.name}</h3>
                <p className="text-gray-600">{selectedVerification.user?.email}</p>
                <p className="text-sm text-gray-500">User ID: {selectedVerification.user?._id}</p>
              </div>
              <div className="ml-auto">
                {getStatusBadge(selectedVerification.status)}
              </div>
            </div>

            {/* Verification Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Verification Type</p>
                <p className="font-medium text-gray-900 capitalize">
                  {selectedVerification.type.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted On</p>
                <p className="font-medium text-gray-900">
                  {formatDate(selectedVerification.createdAt, 'MMM DD, YYYY HH:mm')}
                </p>
              </div>
              {selectedVerification.reviewedAt && (
                <div>
                  <p className="text-sm text-gray-500">Reviewed On</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(selectedVerification.reviewedAt, 'MMM DD, YYYY HH:mm')}
                  </p>
                </div>
              )}
              {selectedVerification.reviewedBy && (
                <div>
                  <p className="text-sm text-gray-500">Reviewed By</p>
                  <p className="font-medium text-gray-900">{selectedVerification.reviewedBy?.name}</p>
                </div>
              )}
            </div>

            {/* Documents */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Submitted Documents</h4>
              <div className="grid grid-cols-2 gap-4">
                {selectedVerification.documents?.map((doc, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-primary-500" />
                      <span className="font-medium text-sm">{doc.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{doc.type}</p>
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:underline"
                    >
                      View Document
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            {selectedVerification.additionalInfo && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {Object.entries(selectedVerification.additionalInfo).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1">
                      <span className="text-sm text-gray-500 capitalize">{key.replace('_', ' ')}</span>
                      <span className="text-sm font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rejection Reason */}
            {selectedVerification.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Rejection Reason
                </h4>
                <p className="text-sm text-red-700">{selectedVerification.rejectionReason}</p>
              </div>
            )}

            {/* Action Buttons */}
            {selectedVerification.status === 'pending' && (
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={() => {
                    setIsDetailOpen(false)
                    openActionModal(selectedVerification, 'approve')
                  }}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </Button>
                <Button 
                  variant="danger"
                  onClick={() => {
                    setIsDetailOpen(false)
                    openActionModal(selectedVerification, 'reject')
                  }}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Action Modal */}
      <Modal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        title={actionType === 'approve' ? 'Approve Verification' : 'Reject Verification'}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            You are about to <strong>{actionType}</strong> the verification for{' '}
            <strong>{selectedVerification?.user?.name}</strong>.
          </p>

          {actionType === 'reject' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-3"
                required
              >
                <option value="">Select a reason...</option>
                {rejectionReasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Or enter custom reason..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />
            </div>
          )}

          {actionType === 'approve' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approval Notes (Optional)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Add any notes about this approval..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsActionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={actionType === 'approve' ? handleApprove : handleReject}
              variant={actionType === 'reject' ? 'danger' : 'primary'}
              disabled={actionType === 'reject' && !rejectionReason}
            >
              Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default UserVerifications
