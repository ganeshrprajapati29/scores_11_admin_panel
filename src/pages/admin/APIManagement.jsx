import { useState, useEffect } from 'react'
import { 
  Code, Key, Plus, Trash2, Copy, RefreshCw,
  Eye, EyeOff, Clock, Globe, Shield, AlertTriangle,
  CheckCircle, XCircle, Terminal, Webhook
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Modal } from '../../components/common/Modal'
import { Table } from '../../components/common/Table'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { Loader } from '../../components/common/Loader'
import { adminService } from '../../services/admin.service'
import { toast } from 'react-hot-toast'
import { formatDate } from '../../utils/formatDate'

const APIManagement = () => {
  const [apiKeys, setApiKeys] = useState([])
  const [webhooks, setWebhooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('keys')
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false)
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showKey, setShowKey] = useState(false)
  const [newKeyData, setNewKeyData] = useState({
    name: '',
    permissions: [],
    expiresIn: '30'
  })
  const [webhookData, setWebhookData] = useState({
    name: '',
    url: '',
    events: [],
    secret: ''
  })

  const availablePermissions = [
    { id: 'read:users', name: 'Read Users', description: 'Access user data' },
    { id: 'write:users', name: 'Write Users', description: 'Modify user data' },
    { id: 'read:matches', name: 'Read Matches', description: 'Access match data' },
    { id: 'write:matches', name: 'Write Matches', description: 'Modify match data' },
    { id: 'read:transactions', name: 'Read Transactions', description: 'Access financial data' },
    { id: 'read:analytics', name: 'Read Analytics', description: 'Access analytics data' },
  ]

  const webhookEvents = [
    { id: 'user.created', name: 'User Created' },
    { id: 'user.updated', name: 'User Updated' },
    { id: 'match.started', name: 'Match Started' },
    { id: 'match.ended', name: 'Match Ended' },
    { id: 'payment.received', name: 'Payment Received' },
    { id: 'subscription.created', name: 'Subscription Created' },
    { id: 'subscription.cancelled', name: 'Subscription Cancelled' },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [keysRes, webhooksRes] = await Promise.all([
        adminService.getAPIKeys(),
        adminService.getWebhooks()
      ])
      setApiKeys(keysRes.data || [])
      setWebhooks(webhooksRes.data || [])
    } catch (error) {
      toast.error('Failed to fetch API data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateKey = async () => {
    try {
      const response = await adminService.createAPIKey(newKeyData)
      toast.success('API key created successfully')
      setApiKeys([response.data, ...apiKeys])
      setIsKeyModalOpen(false)
      setNewKeyData({ name: '', permissions: [], expiresIn: '30' })
      // Show the key once
      setSelectedItem(response.data)
      setShowKey(true)
    } catch (error) {
      toast.error('Failed to create API key')
    }
  }

  const handleCreateWebhook = async () => {
    try {
      const response = await adminService.createWebhook(webhookData)
      toast.success('Webhook created successfully')
      setWebhooks([response.data, ...webhooks])
      setIsWebhookModalOpen(false)
      setWebhookData({ name: '', url: '', events: [], secret: '' })
    } catch (error) {
      toast.error('Failed to create webhook')
    }
  }

  const handleDeleteKey = async () => {
    try {
      await adminService.deleteAPIKey(selectedItem._id)
      toast.success('API key deleted')
      setApiKeys(apiKeys.filter(k => k._id !== selectedItem._id))
      setIsDeleteDialogOpen(false)
      setSelectedItem(null)
    } catch (error) {
      toast.error('Failed to delete API key')
    }
  }

  const handleDeleteWebhook = async () => {
    try {
      await adminService.deleteWebhook(selectedItem._id)
      toast.success('Webhook deleted')
      setWebhooks(webhooks.filter(w => w._id !== selectedItem._id))
      setIsDeleteDialogOpen(false)
      setSelectedItem(null)
    } catch (error) {
      toast.error('Failed to delete webhook')
    }
  }

  const handleRegenerateKey = async (key) => {
    try {
      const response = await adminService.regenerateAPIKey(key._id)
      toast.success('API key regenerated')
      setApiKeys(apiKeys.map(k => k._id === key._id ? response.data : k))
      setSelectedItem(response.data)
      setShowKey(true)
    } catch (error) {
      toast.error('Failed to regenerate key')
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const togglePermission = (permissionId) => {
    setNewKeyData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  const toggleWebhookEvent = (eventId) => {
    setWebhookData(prev => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter(e => e !== eventId)
        : [...prev.events, eventId]
    }))
  }

  const keyColumns = [
    { key: 'name', title: 'Name', render: (key) => (
      <div>
        <p className="font-medium text-gray-900">{key.name}</p>
        <p className="text-xs text-gray-500">{key.keyId}</p>
      </div>
    )},
    { key: 'permissions', title: 'Permissions', render: (key) => (
      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
        {key.permissions?.length || 0} scopes
      </span>
    )},
    { key: 'status', title: 'Status', render: (key) => (
      <span className={`flex items-center gap-1 text-sm ${key.isActive ? 'text-green-600' : 'text-red-600'}`}>
        {key.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
        {key.isActive ? 'Active' : 'Inactive'}
      </span>
    )},
    { key: 'lastUsed', title: 'Last Used', render: (key) => (
      <span className="text-sm text-gray-600">
        {key.lastUsedAt ? formatDate(key.lastUsedAt, 'MMM DD, HH:mm') : 'Never'}
      </span>
    )},
    { key: 'expires', title: 'Expires', render: (key) => (
      <span className="text-sm text-gray-600">
        {key.expiresAt ? formatDate(key.expiresAt, 'MMM DD, YYYY') : 'Never'}
      </span>
    )},
    { key: 'actions', title: 'Actions', render: (key) => (
      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            setSelectedItem(key)
            setShowKey(false)
            setIsKeyModalOpen(true)
          }}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleRegenerateKey(key)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Regenerate"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setSelectedItem(key)
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

  const webhookColumns = [
    { key: 'name', title: 'Name', render: (webhook) => (
      <div>
        <p className="font-medium text-gray-900">{webhook.name}</p>
        <p className="text-xs text-gray-500 truncate max-w-xs">{webhook.url}</p>
      </div>
    )},
    { key: 'events', title: 'Events', render: (webhook) => (
      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
        {webhook.events?.length || 0} events
      </span>
    )},
    { key: 'status', title: 'Status', render: (webhook) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        webhook.status === 'active' ? 'bg-green-100 text-green-700' :
        webhook.status === 'failed' ? 'bg-red-100 text-red-700' :
        'bg-gray-100 text-gray-700'
      }`}>
        {webhook.status}
      </span>
    )},
    { key: 'lastTriggered', title: 'Last Triggered', render: (webhook) => (
      <span className="text-sm text-gray-600">
        {webhook.lastTriggeredAt ? formatDate(webhook.lastTriggeredAt, 'MMM DD, HH:mm') : 'Never'}
      </span>
    )},
    { key: 'actions', title: 'Actions', render: (webhook) => (
      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            setSelectedItem(webhook)
            setIsWebhookModalOpen(true)
          }}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Edit"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setSelectedItem(webhook)
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
          <h1 className="text-2xl font-bold text-gray-900">API Management</h1>
          <p className="text-gray-600 mt-1">Manage API keys and webhooks</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'keys' ? (
            <Button onClick={() => setIsKeyModalOpen(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create API Key
            </Button>
          ) : (
            <Button onClick={() => setIsWebhookModalOpen(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Webhook
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('keys')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'keys'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              API Keys ({apiKeys.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'webhooks'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Webhook className="w-4 h-4" />
              Webhooks ({webhooks.length})
            </div>
          </button>
        </nav>
      </div>

      {/* API Keys Tab */}
      {activeTab === 'keys' && (
        <div className="space-y-4">
          {/* API Endpoint Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">API Base URL</h3>
                <code className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded mt-1 block">
                  https://api.crick11.com/v1
                </code>
                <p className="text-sm text-blue-600 mt-2">
                  Use this base URL with your API key in the Authorization header.
                </p>
              </div>
            </div>
          </div>

          <Table
            columns={keyColumns}
            data={apiKeys}
            emptyMessage="No API keys found. Create one to get started."
          />
        </div>
      )}

      {/* Webhooks Tab */}
      {activeTab === 'webhooks' && (
        <div className="space-y-4">
          {/* Webhook Info */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Webhook className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-purple-900">Webhook Events</h3>
                <p className="text-sm text-purple-700 mt-1">
                  Configure webhooks to receive real-time notifications when events occur in your account.
                </p>
              </div>
            </div>
          </div>

          <Table
            columns={webhookColumns}
            data={webhooks}
            emptyMessage="No webhooks configured. Add one to receive event notifications."
          />
        </div>
      )}

      {/* Create API Key Modal */}
      <Modal
        isOpen={isKeyModalOpen}
        onClose={() => {
          setIsKeyModalOpen(false)
          setShowKey(false)
          setSelectedItem(null)
        }}
        title={selectedItem ? 'API Key Details' : 'Create API Key'}
        size="lg"
      >
        {selectedItem && showKey ? (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-900">Copy Your API Key</h3>
                  <p className="text-sm text-yellow-700">
                    This key will only be shown once. Make sure to copy it now.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <div className="flex gap-2">
                <code className="flex-1 p-3 bg-gray-900 text-green-400 rounded-lg font-mono text-sm break-all">
                  {selectedItem.key}
                </code>
                <Button 
                  variant="secondary"
                  onClick={() => copyToClipboard(selectedItem.key)}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button onClick={() => {
                setIsKeyModalOpen(false)
                setShowKey(false)
                setSelectedItem(null)
              }}>
                Done
              </Button>
            </div>
          </div>
        ) : selectedItem ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <p className="text-gray-900">{selectedItem.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Key ID</label>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded\">{selectedItem.keyId}</code>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
              <div className="flex flex-wrap gap-2">
                {selectedItem.permissions?.map(p => (
                  <span key={p} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => {
                setIsKeyModalOpen(false)
                setSelectedItem(null)
              }}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Name *
              </label>
              <Input
                type="text"
                value={newKeyData.name}
                onChange={(e) => setNewKeyData({ ...newKeyData, name: e.target.value })}
                placeholder="e.g., Production API Key"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Permissions
              </label>
              <div className="space-y-2">
                {availablePermissions.map((permission) => (
                  <label key={permission.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={newKeyData.permissions.includes(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                      className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 mt-0.5"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900\">{permission.name}</p>
                      <p className="text-xs text-gray-500\">{permission.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expires In
              </label>
              <select
                value={newKeyData.expiresIn}
                onChange={(e) => setNewKeyData({ ...newKeyData, expiresIn: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
                <option value="never">Never</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setIsKeyModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateKey}
                disabled={!newKeyData.name || newKeyData.permissions.length === 0}
              >
                Create Key
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create/Edit Webhook Modal */}
      <Modal
        isOpen={isWebhookModalOpen}
        onClose={() => {
          setIsWebhookModalOpen(false)
          setSelectedItem(null)
          setWebhookData({ name: '', url: '', events: [], secret: '' })
        }}
        title={selectedItem ? 'Edit Webhook' : 'Add Webhook'}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Webhook Name *
            </label>
            <Input
              type="text"
              value={webhookData.name}
              onChange={(e) => setWebhookData({ ...webhookData, name: e.target.value })}
              placeholder="e.g., Payment Notifications"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endpoint URL *
            </label>
            <Input
              type="url"
              value={webhookData.url}
              onChange={(e) => setWebhookData({ ...webhookData, url: e.target.value })}
              placeholder="https://your-app.com/webhook"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Events to Subscribe
            </label>
            <div className="grid grid-cols-2 gap-2">
              {webhookEvents.map((event) => (
                <label key={event.id} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={webhookData.events.includes(event.id)}
                    onChange={() => toggleWebhookEvent(event.id)}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{event.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secret Key (Optional)
            </label>
            <Input
              type="text"
              value={webhookData.secret}
              onChange={(e) => setWebhookData({ ...webhookData, secret: e.target.value })}
              placeholder="For webhook signature verification"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used to verify webhook signatures. Leave empty to auto-generate.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsWebhookModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateWebhook}
              disabled={!webhookData.name || !webhookData.url || webhookData.events.length === 0}
            >
              {selectedItem ? 'Update Webhook' : 'Create Webhook'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={activeTab === 'keys' ? handleDeleteKey : handleDeleteWebhook}
        title={`Delete ${activeTab === 'keys' ? 'API Key' : 'Webhook'}`}
        message={`Are you sure you want to delete "${selectedItem?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}

export default APIManagement
