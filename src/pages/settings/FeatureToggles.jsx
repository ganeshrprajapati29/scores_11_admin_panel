import { useState, useEffect } from 'react'
import { 
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  CreditCard,
  Users,
  Sparkles,
  FlaskConical
} from "lucide-react";
const FeatureToggles = () => {
  const [features, setFeatures] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingFeature, setEditingFeature] = useState(null)
  const [formData, setFormData] = useState({
    name: '', key: '', description: '', category: 'general', visibility: 'public'
  })

  const defaultFeatures = [
    { _id: '1', name: 'UPI Payment', key: 'upi_payment', description: 'Enable UPI payments for transactions', isEnabled: true, category: 'payment', visibility: 'public' },
    { _id: '2', name: 'Phone Login', key: 'phone_login', description: 'Allow users to login with phone number', isEnabled: true, category: 'auth', visibility: 'public' },
    { _id: '3', name: 'Social Sharing', key: 'social_sharing', description: 'Enable social media sharing features', isEnabled: true, category: 'social', visibility: 'public' },
    { _id: '4', name: 'Premium Features', key: 'premium_features', description: 'Enable premium subscription features', isEnabled: false, category: 'premium', visibility: 'public' },
    { _id: '5', name: 'AI Predictions', key: 'ai_predictions', description: 'Enable AI-based match predictions', isEnabled: true, category: 'experimental', visibility: 'beta' },
    { _id: '6', name: 'Live Streaming', key: 'live_streaming', description: 'Enable live match streaming', isEnabled: true, category: 'general', visibility: 'public' },
    { _id: '7', name: 'Fantasy Contest', key: 'fantasy_contest', description: 'Enable fantasy cricket contests', isEnabled: true, category: 'premium', visibility: 'public' },
    { _id: '8', name: 'Video Highlights', key: 'video_highlights', description: 'Enable video highlights for matches', isEnabled: false, category: 'general', visibility: 'public' },
  ]

  useEffect(() => {
    fetchFeatures()
  }, [categoryFilter])

  const fetchFeatures = async () => {
    try {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setFeatures(defaultFeatures)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error('Error fetching features:', error)
      setLoading(false)
    }
  }

  const handleToggle = async (featureId) => {
    setFeatures(features.map(f => 
      f._id === featureId ? { ...f, isEnabled: !f.isEnabled } : f
    ))
  }

  const handleDelete = async (featureId) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      setFeatures(features.filter(f => f._id !== featureId))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingFeature) {
      setFeatures(features.map(f => 
        f._id === editingFeature._id ? { ...f, ...formData } : f
      ))
    } else {
      setFeatures([...features, { ...formData, _id: Date.now().toString(), isEnabled: false }])
    }
    setShowModal(false)
    setEditingFeature(null)
    setFormData({ name: '', key: '', description: '', category: 'general', visibility: 'public' })
  }

  const filteredFeatures = features.filter(f => 
    (categoryFilter === 'all' || f.category === categoryFilter) &&
    (f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     f.key.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'payment': return <CreditCard size={16} />
      case 'auth': return <Users size={16} />
      case 'social': return <Zap size={16} />
      case 'premium': return <Sparkles size={16} />
      case 'experimental': return <FlaskConical size={16} />
      default: return <Zap size={16} />
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      payment: 'bg-green-100 text-green-700',
      auth: 'bg-blue-100 text-blue-700',
      social: 'bg-yellow-100 text-yellow-700',
      premium: 'bg-purple-100 text-purple-700',
      experimental: 'bg-orange-100 text-orange-700',
      general: 'bg-gray-100 text-gray-700'
    }
    return colors[category] || colors.general
  }

  const stats = {
    total: features.length,
    enabled: features.filter(f => f.isEnabled).length,
    disabled: features.filter(f => !f.isEnabled).length,
    experimental: features.filter(f => f.category === 'experimental').length
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feature Toggles</h1>
          <p className="text-gray-500 mt-1">Control app features and functionality</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Feature
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><Zap className="w-6 h-6 text-blue-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{stats.total}</p><p className="text-sm text-gray-500">Total Features</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{stats.enabled}</p><p className="text-sm text-gray-500">Enabled</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center"><XCircle className="w-6 h-6 text-red-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{stats.disabled}</p><p className="text-sm text-gray-500">Disabled</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center"><FlaskConical className="w-6 h-6 text-orange-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{stats.experimental}</p><p className="text-sm text-gray-500">Experimental</p></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search features..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500">
            <option value="all">All Categories</option>
            <option value="payment">Payment</option>
            <option value="auth">Auth</option>
            <option value="social">Social</option>
            <option value="premium">Premium</option>
            <option value="experimental">Experimental</option>
            <option value="general">General</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 animate-pulse"><div className="h-4 bg-gray-200 rounded w-1/3"></div></div>
            ))
          ) : filteredFeatures.length === 0 ? (
            <div className="p-12 text-center text-gray-500"><Zap size={48} className="mx-auto mb-4 text-gray-300" /><p>No features found</p></div>
          ) : (
            filteredFeatures.map((feature) => (
              <div key={feature._id} className="p-4 hover:bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => handleToggle(feature._id)} className={`relative w-12 h-6 rounded-full transition-colors ${feature.isEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${feature.isEnabled ? 'left-7' : 'left-1'}`}></span>
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{feature.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(feature.category)}`}>
                        {getCategoryIcon(feature.category)} {feature.category}
                      </span>
                      {feature.visibility === 'beta' && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">Beta</span>}
                    </div>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                    <p className="text-xs text-gray-400 mt-1">Key: {feature.key}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditingFeature(feature); setFormData(feature); setShowModal(true) }} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-lg"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(feature._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg"><Trash2 size={18} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editingFeature ? 'Edit Feature' : 'Add New Feature'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feature Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feature Key</label>
                <input type="text" value={formData.key} onChange={(e) => setFormData({...formData, key: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500" rows={2}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option value="general">General</option>
                    <option value="payment">Payment</option>
                    <option value="auth">Auth</option>
                    <option value="social">Social</option>
                    <option value="premium">Premium</option>
                    <option value="experimental">Experimental</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                  <select value={formData.visibility} onChange={(e) => setFormData({...formData, visibility: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option value="public">Public</option>
                    <option value="admin">Admin Only</option>
                    <option value="beta">Beta</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditingFeature(null) }} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">{editingFeature ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FeatureToggles
