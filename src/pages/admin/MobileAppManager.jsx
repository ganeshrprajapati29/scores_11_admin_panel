import { useState, useEffect } from 'react'
import { 
  Smartphone, Image, Type, Palette, Bell, Settings,
  Plus, Trash2, Eye, Save, RefreshCw, Upload, GripVertical,
  ToggleLeft, ToggleRight, Monitor, Tablet, Info
} from 'lucide-react'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import Table from '../../components/common/Table'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Loader from '../../components/common/Loader'
import adminService from '../../services/admin.service'

import { toast } from 'react-hot-toast'
import { formatDate } from '../../utils/formatDate'

const MobileAppManager = () => {
  const [activeTab, setActiveTab] = useState('banners')
  const [loading, setLoading] = useState(true)
  const [banners, setBanners] = useState([])
  const [appText, setAppText] = useState({})
  const [appConfig, setAppConfig] = useState({})
  const [notifications, setNotifications] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [previewDevice, setPreviewDevice] = useState('mobile')

  // Form states
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    actionType: 'none',
    actionValue: '',
    priority: 1,
    isActive: true,
    startDate: '',
    endDate: ''
  })

  const [textForm, setTextForm] = useState({
    key: '',
    value: '',
    language: 'en'
  })

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      if (activeTab === 'banners') {
        const response = await adminService.getAppBanners()
        setBanners(response.data || [])
      } else if (activeTab === 'text') {
        const response = await adminService.getAppText()
        setAppText(response.data || {})
      } else if (activeTab === 'config') {
        const response = await adminService.getAppConfig()
        setAppConfig(response.data || {})
      } else if (activeTab === 'notifications') {
        const response = await adminService.getAppNotifications()
        setNotifications(response.data || [])
      }
    } catch (error) {
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveBanner = async () => {
    try {
      if (selectedItem) {
        await adminService.updateAppBanner(selectedItem._id, bannerForm)
        toast.success('Banner updated')
      } else {
        await adminService.createAppBanner(bannerForm)
        toast.success('Banner created')
      }
      setIsModalOpen(false)
      setSelectedItem(null)
      resetBannerForm()
      fetchData()
    } catch (error) {
      toast.error('Failed to save banner')
    }
  }

  const handleDeleteBanner = async () => {
    try {
      await adminService.deleteAppBanner(selectedItem._id)
      toast.success('Banner deleted')
      setIsDeleteDialogOpen(false)
      setSelectedItem(null)
      fetchData()
    } catch (error) {
      toast.error('Failed to delete banner')
    }
  }

  const handleSaveText = async () => {
    try {
      await adminService.updateAppText(textForm.key, textForm)
      toast.success('Text updated')
      setAppText({ ...appText, [textForm.key]: textForm.value })
      setTextForm({ key: '', value: '', language: 'en' })
    } catch (error) {
      toast.error('Failed to update text')
    }
  }

  const handleSaveConfig = async () => {
    try {
      await adminService.updateAppConfig(appConfig)
      toast.success('Configuration saved')
    } catch (error) {
      toast.error('Failed to save configuration')
    }
  }

  const handleSendNotification = async (notification) => {
    try {
      await adminService.sendPushNotification(notification)
      toast.success('Notification sent')
    } catch (error) {
      toast.error('Failed to send notification')
    }
  }

  const resetBannerForm = () => {
    setBannerForm({
      title: '',
      subtitle: '',
      image: '',
      actionType: 'none',
      actionValue: '',
      priority: 1,
      isActive: true,
      startDate: '',
      endDate: ''
    })
  }

  const openEditModal = (banner) => {
    setSelectedItem(banner)
    setBannerForm({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image: banner.image,
      actionType: banner.actionType || 'none',
      actionValue: banner.actionValue || '',
      priority: banner.priority || 1,
      isActive: banner.isActive,
      startDate: banner.startDate ? banner.startDate.split('T')[0] : '',
      endDate: banner.endDate ? banner.endDate.split('T')[0] : ''
    })
    setIsModalOpen(true)
  }

  const bannerColumns = [
    { key: 'priority', title: 'Order', render: (b) => (
      <div className="flex items-center gap-2">
        <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
        <span className="font-medium">{b.priority}</span>
      </div>
    )},
    { key: 'image', title: 'Banner', render: (b) => (
      <div className="relative w-32 h-16 rounded-lg overflow-hidden bg-gray-100">
        <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
        {!b.isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xs font-medium">Inactive</span>
          </div>
        )}
      </div>
    )},
    { key: 'details', title: 'Details', render: (b) => (
      <div>
        <p className="font-medium text-gray-900">{b.title}</p>
        <p className="text-sm text-gray-500">{b.subtitle}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded">
            {b.actionType}
          </span>
          {b.actionValue && (
            <span className="text-xs text-gray-500 truncate max-w-xs">
              {b.actionValue}
            </span>
          )}
        </div>
      </div>
    )},
    { key: 'schedule', title: 'Schedule', render: (b) => (
      <div className="text-sm text-gray-600">
        {b.startDate && (
          <p>From: {formatDate(b.startDate, 'MMM DD, YYYY')}</p>
        )}
        {b.endDate && (
          <p>To: {formatDate(b.endDate, 'MMM DD, YYYY')}</p>
        )}
        {!b.startDate && !b.endDate && (
          <span className="text-gray-400">Always active</span>
        )}
      </div>
    )},
    { key: 'actions', title: 'Actions', render: (b) => (
      <div className="flex items-center gap-1">
        <button
          onClick={() => openEditModal(b)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setSelectedItem(b)
            setIsDeleteDialogOpen(true)
          }}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          <h1 className="text-2xl font-bold text-gray-900">Mobile App Manager</h1>
          <p className="text-gray-600 mt-1">Control all mobile app content dynamically</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Preview:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`p-2 rounded ${previewDevice === 'mobile' ? 'bg-white shadow-sm' : ''}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewDevice('tablet')}
              className={`p-2 rounded ${previewDevice === 'tablet' ? 'bg-white shadow-sm' : ''}`}
            >
              <Tablet className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {[
            { id: 'banners', label: 'Banners', icon: Image },
            { id: 'text', label: 'App Text', icon: Type },
            { id: 'config', label: 'Configuration', icon: Settings },
            { id: 'notifications', label: 'Push Notifications', icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Banners Tab */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Home Banners</h2>
            <Button onClick={() => {
              setSelectedItem(null)
              resetBannerForm()
              setIsModalOpen(true)
            }} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Banner
            </Button>
          </div>

          <Table
            columns={bannerColumns}
            data={banners}
            emptyMessage="No banners found. Create one to display in the app."
          />

          {/* Live Preview */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Live Preview
            </h3>
            <div className={`mx-auto bg-white rounded-xl shadow-lg overflow-hidden ${
              previewDevice === 'mobile' ? 'w-80' : 'w-96'
            }`}>
              <div className="bg-primary-600 text-white p-3 text-center text-sm font-medium">
                Crick11 App
              </div>
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {banners.filter(b => b.isActive).map((banner, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden">
                    <img src={banner.image} alt={banner.title} className="w-full h-32 object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-white font-medium text-sm">{banner.title}</p>
                      <p className="text-white/80 text-xs">{banner.subtitle}</p>
                    </div>
                  </div>
                ))}
                {banners.filter(b => b.isActive).length === 0 && (
                  <p className="text-center text-gray-400 py-8">No active banners</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* App Text Tab */}
      {activeTab === 'text' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Text Editor */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit App Text</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Text Key
                  </label>
                  <select
                    value={textForm.key}
                    onChange={(e) => {
                      const key = e.target.value
                      setTextForm({
                        key,
                        value: appText[key] || '',
                        language: 'en'
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select a text key...</option>
                    <option value="app_name">App Name</option>
                    <option value="welcome_title">Welcome Title</option>
                    <option value="welcome_subtitle">Welcome Subtitle</option>
                    <option value="home_header">Home Header</option>
                    <option value="contest_title">Contest Title</option>
                    <option value="wallet_title">Wallet Title</option>
                    <option value="profile_title">Profile Title</option>
                    <option value="login_title">Login Title</option>
                    <option value="signup_title">Signup Title</option>
                    <option value="footer_text">Footer Text</option>
                    <option value="terms_text">Terms & Conditions Intro</option>
                    <option value="privacy_text">Privacy Policy Intro</option>
                  </select>
                </div>

                {textForm.key && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Value
                      </label>
                      <Input
                        type="text"
                        value={textForm.value}
                        onChange={(e) => setTextForm({ ...textForm, value: e.target.value })}
                        placeholder="Enter text value..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language
                      </label>
                      <select
                        value={textForm.language}
                        onChange={(e) => setTextForm({ ...textForm, language: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="bn">Bengali</option>
                        <option value="ta">Tamil</option>
                        <option value="te">Telugu</option>
                      </select>
                    </div>

                    <Button onClick={handleSaveText} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Update Text
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Current Texts */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current App Texts</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {Object.entries(appText).map(([key, value]) => (
                  <div key={key} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{key}</p>
                    <p className="text-sm text-gray-900 font-medium">{value}</p>
                  </div>
                ))}
                {Object.keys(appText).length === 0 && (
                  <p className="text-center text-gray-400 py-8">No custom texts configured</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Tab */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">App Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* General Settings */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  General Settings
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    App Version
                  </label>
                  <Input
                    type="text"
                    value={appConfig.version || ''}
                    onChange={(e) => setAppConfig({ ...appConfig, version: e.target.value })}
                    placeholder="e.g., 2.1.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Required Version
                  </label>
                  <Input
                    type="text"
                    value={appConfig.minVersion || ''}
                    onChange={(e) => setAppConfig({ ...appConfig, minVersion: e.target.value })}
                    placeholder="Force update if below this version"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Maintenance Mode</p>
                    <p className="text-sm text-gray-500">Show maintenance screen</p>
                  </div>
                  <button
                    onClick={() => setAppConfig({ ...appConfig, maintenanceMode: !appConfig.maintenanceMode })}
                    className={`p-2 rounded-lg transition-colors ${
                      appConfig.maintenanceMode ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {appConfig.maintenanceMode ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* Feature Flags */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Feature Flags
                </h4>

                {[
                  { key: 'enableContests', label: 'Contests', desc: 'Enable contest feature' },
                  { key: 'enableWallet', label: 'Wallet', desc: 'Enable wallet & transactions' },
                  { key: 'enableStore', label: 'Store', desc: 'Enable merchandise store' },
                  { key: 'enableLiveScores', label: 'Live Scores', desc: 'Enable live match scoring' },
                  { key: 'enablePredictions', label: 'Predictions', desc: 'Enable match predictions' },
                  { key: 'enableReferral', label: 'Referral System', desc: 'Enable invite & earn' },
                ].map((feature) => (
                  <div key={feature.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{feature.label}</p>
                      <p className="text-sm text-gray-500">{feature.desc}</p>
                    </div>
                    <button
                      onClick={() => setAppConfig({ ...appConfig, [feature.key]: !appConfig[feature.key] })}
                      className={`p-2 rounded-lg transition-colors ${
                        appConfig[feature.key] ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {appConfig[feature.key] ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button onClick={handleSaveConfig} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Push Notifications</h2>
            <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Send Notification
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {notifications.map((notification) => (
              <div key={notification._id} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    notification.status === 'sent' ? 'bg-green-100 text-green-700' :
                    notification.status === 'scheduled' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {notification.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(notification.createdAt, 'MMM DD')}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{notification.title}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{notification.body}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Info className="w-3 h-3" />
                  {notification.targetAudience || 'All users'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Banner Modal */}
      <Modal
        isOpen={isModalOpen && activeTab === 'banners'}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedItem(null)
          resetBannerForm()
        }}
        title={selectedItem ? 'Edit Banner' : 'Add Banner'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <Input
                type="text"
                value={bannerForm.title}
                onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                placeholder="Banner title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <Input
                type="text"
                value={bannerForm.subtitle}
                onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                placeholder="Banner subtitle"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image *</label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={bannerForm.image}
                onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                placeholder="Image URL"
                className="flex-1"
              />
              <Button variant="secondary" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </div>
            {bannerForm.image && (
              <div className="mt-2 w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                <img src={bannerForm.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
              <select
                value={bannerForm.actionType}
                onChange={(e) => setBannerForm({ ...bannerForm, actionType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="none">None</option>
                <option value="url">Open URL</option>
                <option value="screen">Navigate to Screen</option>
                <option value="match">Open Match</option>
                <option value="contest">Open Contest</option>
                <option value="product">Open Product</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action Value</label>
              <Input
                type="text"
                value={bannerForm.actionValue}
                onChange={(e) => setBannerForm({ ...bannerForm, actionValue: e.target.value })}
                placeholder="URL, Screen ID, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <Input
                type="number"
                value={bannerForm.priority}
                onChange={(e) => setBannerForm({ ...bannerForm, priority: parseInt(e.target.value) })}
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <Input
                type="date"
                value={bannerForm.startDate}
                onChange={(e) => setBannerForm({ ...bannerForm, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <Input
                type="date"
                value={bannerForm.endDate}
                onChange={(e) => setBannerForm({ ...bannerForm, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={bannerForm.isActive}
              onChange={(e) => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
              className="w-4 h-4 text-primary-600 rounded"
            />
            <label className="text-sm font-medium text-gray-700">Active</label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => {
              setIsModalOpen(false)
              setSelectedItem(null)
              resetBannerForm()
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveBanner} disabled={!bannerForm.title || !bannerForm.image}>
              {selectedItem ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setSelectedItem(null)
        }}
        onConfirm={handleDeleteBanner}
        title="Delete Banner"
        message="Are you sure you want to delete this banner? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}

export default MobileAppManager
