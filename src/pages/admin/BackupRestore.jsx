import { useState, useEffect } from 'react'
import { 
  Database, Download, Upload, Trash2, Clock, 
  CheckCircle, AlertTriangle, RefreshCw, FileArchive,
  Calendar, HardDrive, Play, RotateCcw
} from 'lucide-react'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Table from '../../components/common/Table'
import Loader from '../../components/common/Loader'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import adminService from '../../services/admin.service'

import { toast } from 'react-hot-toast'
import { formatDate } from '../../utils/formatDate'

const BackupRestore = () => {
  const [backups, setBackups] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState(null)
  const [backupInProgress, setBackupInProgress] = useState(false)
  const [restoreInProgress, setRestoreInProgress] = useState(false)
  const [backupConfig, setBackupConfig] = useState({
    includeUsers: true,
    includeMatches: true,
    includeTournaments: true,
    includeStore: true,
    includeContent: true,
    includeSettings: true,
    compressionLevel: 'medium',
    encryption: false
  })

  useEffect(() => {
    fetchBackups()
  }, [])

  const fetchBackups = async () => {
    try {
      setLoading(true)
      const response = await adminService.getBackups()
      setBackups(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch backups')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateBackup = async () => {
    try {
      setBackupInProgress(true)
      await adminService.createBackup(backupConfig)
      toast.success('Backup created successfully')
      setIsCreateModalOpen(false)
      fetchBackups()
    } catch (error) {
      toast.error(error.message || 'Failed to create backup')
    } finally {
      setBackupInProgress(false)
    }
  }

  const handleRestoreBackup = async () => {
    if (!selectedBackup) return
    
    try {
      setRestoreInProgress(true)
      await adminService.restoreBackup(selectedBackup._id)
      toast.success('System restored successfully')
      setIsRestoreModalOpen(false)
      setSelectedBackup(null)
    } catch (error) {
      toast.error(error.message || 'Failed to restore backup')
    } finally {
      setRestoreInProgress(false)
    }
  }

  const handleDeleteBackup = async () => {
    if (!selectedBackup) return
    
    try {
      await adminService.deleteBackup(selectedBackup._id)
      toast.success('Backup deleted successfully')
      setIsDeleteDialogOpen(false)
      setSelectedBackup(null)
      fetchBackups()
    } catch (error) {
      toast.error('Failed to delete backup')
    }
  }

  const handleDownloadBackup = async (backup) => {
    try {
      const response = await adminService.downloadBackup(backup._id)
      const blob = new Blob([response.data], { type: 'application/zip' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `crick11-backup-${backup.createdAt}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success('Backup downloaded')
    } catch (error) {
      toast.error('Failed to download backup')
    }
  }

  const getBackupSize = (size) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'in_progress':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const columns = [
    { key: 'name', title: 'Backup Name', render: (backup) => (
      <div className="flex items-center gap-2">
        <FileArchive className="w-5 h-5 text-primary-500" />
        <span className="font-medium">{backup.name}</span>
      </div>
    )},
    { key: 'createdAt', title: 'Created', render: (backup) => (
      <div className="text-sm text-gray-600">
        {formatDate(backup.createdAt, 'MMM DD, YYYY HH:mm')}
      </div>
    )},
    { key: 'size', title: 'Size', render: (backup) => (
      <span className="text-sm font-mono text-gray-600">
        {getBackupSize(backup.size)}
      </span>
    )},
    { key: 'type', title: 'Type', render: (backup) => (
      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
        {backup.type}
      </span>
    )},
    { key: 'status', title: 'Status', render: (backup) => (
      <div className="flex items-center gap-2">
        {getStatusIcon(backup.status)}
        <span className="text-sm capitalize">{backup.status}</span>
      </div>
    )},
    { key: 'actions', title: 'Actions', render: (backup) => (
      <div className="flex items-center gap-2">
        {backup.status === 'completed' && (
          <>
            <button
              onClick={() => handleDownloadBackup(backup)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSelectedBackup(backup)
                setIsRestoreModalOpen(true)
              }}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Restore"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </>
        )}
        <button
          onClick={() => {
            setSelectedBackup(backup)
            setIsDeleteDialogOpen(true)
          }}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
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
          <h1 className="text-2xl font-bold text-gray-900">Backup & Restore</h1>
          <p className="text-gray-600 mt-1">Manage system backups and restore points</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Database className="w-4 h-4" />
          Create Backup
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{backups.length}</p>
              <p className="text-sm text-gray-600">Total Backups</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {backups.filter(b => b.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Successful</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <HardDrive className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {getBackupSize(backups.reduce((acc, b) => acc + (b.size || 0), 0))}
              </p>
              <p className="text-sm text-gray-600">Total Size</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {backups[0] ? formatDate(backups[0].createdAt, 'MMM DD') : 'Never'}
              </p>
              <p className="text-sm text-gray-600">Last Backup</p>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Schedule Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Automatic Backup Schedule</h3>
            <p className="text-sm text-blue-700 mt-1">
              Daily backups are scheduled at 2:00 AM UTC. The system retains the last 30 backups automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Backups Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table
          columns={columns}
          data={backups}
          emptyMessage="No backups found. Create your first backup to get started."
        />
      </div>

      {/* Create Backup Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Backup"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Select the data you want to include in this backup:
          </p>

          <div className="space-y-3">
            {[
              { key: 'includeUsers', label: 'Users & Player Data', description: 'All user accounts, profiles, and player information' },
              { key: 'includeMatches', label: 'Matches & Scoring', description: 'Match data, scoring records, and statistics' },
              { key: 'includeTournaments', label: 'Tournaments & Contests', description: 'Tournament data, contests, and leaderboards' },
              { key: 'includeStore', label: 'Store & Orders', description: 'Product catalog, orders, and transaction history' },
              { key: 'includeContent', label: 'Content (Blogs, News, Community)', description: 'All content including posts, comments, and media' },
              { key: 'includeSettings', label: 'System Settings', description: 'Application settings and configurations' },
            ].map((item) => (
              <label key={item.key} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={backupConfig[item.key]}
                  onChange={(e) => setBackupConfig({ ...backupConfig, [item.key]: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 mt-0.5"
                />
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compression Level
              </label>
              <select
                value={backupConfig.compressionLevel}
                onChange={(e) => setBackupConfig({ ...backupConfig, compressionLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="low">Low (Faster)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="high">High (Smaller Size)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Encryption
              </label>
              <select
                value={backupConfig.encryption}
                onChange={(e) => setBackupConfig({ ...backupConfig, encryption: e.target.value === 'true' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="false">No Encryption</option>
                <option value="true">AES-256 Encryption</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="secondary" 
              onClick={() => setIsCreateModalOpen(false)}
              disabled={backupInProgress}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateBackup}
              disabled={backupInProgress}
              className="flex items-center gap-2"
            >
              {backupInProgress ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Backup
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Restore Modal */}
      <Modal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        title="Restore System"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900">Warning</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Restoring will overwrite all current data with the backup data. This action cannot be undone.
                  Make sure to create a backup of current data before proceeding.
                </p>
              </div>
            </div>
          </div>

          {selectedBackup && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Selected Backup:</p>
              <p className="font-medium text-gray-900">{selectedBackup.name}</p>
              <p className="text-sm text-gray-500">
                Created: {formatDate(selectedBackup.createdAt, 'MMM DD, YYYY HH:mm')}
              </p>
              <p className="text-sm text-gray-500">
                Size: {getBackupSize(selectedBackup.size)}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="secondary" 
              onClick={() => setIsRestoreModalOpen(false)}
              disabled={restoreInProgress}
            >
              Cancel
            </Button>
            <Button 
              variant="danger"
              onClick={handleRestoreBackup}
              disabled={restoreInProgress}
              className="flex items-center gap-2"
            >
              {restoreInProgress ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Confirm Restore
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteBackup}
        title="Delete Backup"
        message={`Are you sure you want to delete "${selectedBackup?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}

export default BackupRestore
