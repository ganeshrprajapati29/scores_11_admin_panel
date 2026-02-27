import { useState, useEffect } from 'react'
import { 
  Mail, Plus, Edit2, Trash2, Search, Eye, 
  Send, CheckCircle, XCircle, Code, FileText,
  Copy, RefreshCw
} from 'lucide-react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import Table from '../../components/common/Table'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Loader from '../../components/common/Loader'
import adminService from '../../services/admin.service'

import { toast } from 'react-hot-toast'

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [testEmail, setTestEmail] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
    type: 'transactional',
    isActive: true,
    variables: []
  })

  const templateTypes = [
    { id: 'transactional', name: 'Transactional' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'notification', name: 'Notification' },
    { id: 'welcome', name: 'Welcome' },
    { id: 'password_reset', name: 'Password Reset' },
  ]

  const availableVariables = [
    { name: '{{user.name}}', description: 'User full name' },
    { name: '{{user.email}}', description: 'User email address' },
    { name: '{{user.id}}', description: 'User ID' },
    { name: '{{app.name}}', description: 'Application name' },
    { name: '{{app.url}}', description: 'Application URL' },
    { name: '{{date}}', description: 'Current date' },
    { name: '{{time}}', description: 'Current time' },
    { name: '{{match.name}}', description: 'Match name' },
    { name: '{{tournament.name}}', description: 'Tournament name' },
    { name: '{{amount}}', description: 'Amount/Price' },
    { name: '{{otp}}', description: 'OTP code' },
    { name: '{{link}}', description: 'Action link' },
  ]

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await adminService.getEmailTemplates()
      setTemplates(response.data || [])
    } catch (error) {
      toast.error('Failed to fetch email templates')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedTemplate) {
        await adminService.updateEmailTemplate(selectedTemplate._id, formData)
        toast.success('Template updated successfully')
      } else {
        await adminService.createEmailTemplate(formData)
        toast.success('Template created successfully')
      }
      setIsModalOpen(false)
      setSelectedTemplate(null)
      resetForm()
      fetchTemplates()
    } catch (error) {
      toast.error(error.message || 'Failed to save template')
    }
  }

  const handleDelete = async () => {
    try {
      await adminService.deleteEmailTemplate(selectedTemplate._id)
      toast.success('Template deleted successfully')
      setIsDeleteDialogOpen(false)
      setSelectedTemplate(null)
      fetchTemplates()
    } catch (error) {
      toast.error('Failed to delete template')
    }
  }

  const handleSendTest = async () => {
    try {
      await adminService.sendTestEmail(selectedTemplate._id, testEmail)
      toast.success('Test email sent successfully')
      setIsTestModalOpen(false)
      setTestEmail('')
    } catch (error) {
      toast.error('Failed to send test email')
    }
  }

  const handleDuplicate = async (template) => {
    try {
      const duplicateData = {
        ...template,
        name: `${template.name} (Copy)`,
        _id: undefined
      }
      await adminService.createEmailTemplate(duplicateData)
      toast.success('Template duplicated successfully')
      fetchTemplates()
    } catch (error) {
      toast.error('Failed to duplicate template')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      body: '',
      type: 'transactional',
      isActive: true,
      variables: []
    })
  }

  const openEditModal = (template) => {
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      subject: template.subject,
      body: template.body,
      type: template.type,
      isActive: template.isActive,
      variables: template.variables || []
    })
    setIsModalOpen(true)
  }

  const openCreateModal = () => {
    setSelectedTemplate(null)
    resetForm()
    setIsModalOpen(true)
  }

  const openPreview = (template) => {
    setSelectedTemplate(template)
    setIsPreviewOpen(true)
  }

  const insertVariable = (variable) => {
    setFormData(prev => ({
      ...prev,
      body: prev.body + ' ' + variable
    }))
  }

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns = [
    { key: 'name', title: 'Template Name', render: (template) => (
      <div className="flex items-center gap-2">
        <Mail className="w-5 h-5 text-primary-500" />
        <span className="font-medium">{template.name}</span>
      </div>
    )},
    { key: 'subject', title: 'Subject', render: (template) => (
      <p className="text-sm text-gray-600 truncate max-w-xs">{template.subject}</p>
    )},
    { key: 'type', title: 'Type', render: (template) => (
      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs capitalize">
        {template.type.replace('_', ' ')}
      </span>
    )},
    { key: 'status', title: 'Status', render: (template) => (
      <span className={`flex items-center gap-1 ${template.isActive ? 'text-green-600' : 'text-red-600'}`}>
        {template.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
        {template.isActive ? 'Active' : 'Inactive'}
      </span>
    )},
    { key: 'actions', title: 'Actions', render: (template) => (
      <div className="flex items-center gap-1">
        <button
          onClick={() => openPreview(template)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Preview"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setSelectedTemplate(template)
            setIsTestModalOpen(true)
          }}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Send Test"
        >
          <Send className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleDuplicate(template)}
          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          title="Duplicate"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={() => openEditModal(template)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setSelectedTemplate(template)
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
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-gray-600 mt-1">Manage email templates for notifications and marketing</p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Template
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Templates Table */}
      <Table
        columns={columns}
        data={filteredTemplates}
        emptyMessage="No email templates found"
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTemplate ? 'Edit Template' : 'Create Template'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Welcome Email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                {templateTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject Line *
            </label>
            <Input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g., Welcome to Crick11!"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Body (HTML) *
              </label>
              <textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="<html>...</html>"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                rows={15}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Variables
              </label>
              <div className="border border-gray-200 rounded-lg p-2 h-[400px] overflow-y-auto">
                <p className="text-xs text-gray-500 mb-2">Click to insert:</p>
                {availableVariables.map((variable) => (
                  <button
                    key={variable.name}
                    type="button"
                    onClick={() => insertVariable(variable.name)}
                    className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm mb-1"
                  >
                    <code className="text-primary-600 text-xs">{variable.name}</code>
                    <p className="text-xs text-gray-500">{variable.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Template is active
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedTemplate ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Template Preview"
        size="lg"
      >
        {selectedTemplate && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Subject:</p>
              <p className="font-medium">{selectedTemplate.subject}</p>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-700">Email Preview</p>
              </div>
              <div 
                className="p-4 bg-white"
                dangerouslySetInnerHTML={{ __html: selectedTemplate.body }}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Test Email Modal */}
      <Modal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        title="Send Test Email"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Send a test email using template: <strong>{selectedTemplate?.name}</strong>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Email Address *
            </label>
            <Input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsTestModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendTest} disabled={!testEmail}>
              <Send className="w-4 h-4 mr-2" />
              Send Test
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Template"
        message={`Are you sure you want to delete "${selectedTemplate?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}

export default EmailTemplates
