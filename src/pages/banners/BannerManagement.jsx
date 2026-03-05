import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Image, Plus, Search, Filter, MoreVertical, 
  Edit, Trash2, Eye, EyeOff, ToggleLeft, ToggleRight,
  GripVertical, BarChart3, ExternalLink, Video, FileImage,
  ChevronRight, X, Upload
} from 'lucide-react'
import bannerService from '../../services/banner.service'

const BannerManagement = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState(null)
  const [analytics, setAnalytics] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    videoUrl: '',
    gifUrl: '',
    link: '',
    linkType: 'none',
    position: 'general',
    order: 0,
    size: { width: 1920, height: 500, aspectRatio: '16:9' },
    isActive: true,
    startDate: '',
    endDate: '',
    targetAudience: 'all'
  })

  const positions = [
    { value: 'general', label: 'General' },
    { value: 'home', label: 'Home Page' },
    { value: 'tournament', label: 'Tournament' },
    { value: 'match', label: 'Match' },
    { value: 'team', label: 'Team' },
    { value: 'player', label: 'Player' },
    { value: 'news', label: 'News' },
    { value: 'blog', label: 'Blog' },
    { value: 'store', label: 'Store' }
  ]

  const aspectRatios = [
    { value: '16:9', label: '16:9 (Landscape)' },
    { value: '4:3', label: '4:3 (Standard)' },
    { value: '1:1', label: '1:1 (Square)' },
    { value: '9:16', label: '9:16 (Portrait)' }
  ]

  useEffect(() => {
    fetchBanners()
  }, [pagination.page, filter])

  useEffect(() => {
    if (showAnalytics) {
      fetchAnalytics()
    }
  }, [showAnalytics])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filter !== 'all' && { position: filter })
      }
      const response = await bannerService.getAllBanners(params)
      setBanners(response.data.banners || [])
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination?.total || 0
      }))
    } catch (error) {
      console.error('Error fetching banners:', error)
      // Mock data
      setBanners([
        { _id: '1', title: 'Summer Tournament 2024', image: 'https://picsum.photos/800/400', position: 'home', isActive: true, order: 1, clickCount: 1250, impressions: 15000 },
        { _id: '2', title: 'New Season Offers', image: 'https://picsum.photos/800/401', position: 'store', isActive: true, order: 2, clickCount: 890, impressions: 8000 },
        { _id: '3', title: 'Player Tryouts', image: 'https://picsum.photos/800/402', position: 'general', isActive: false, order: 3, clickCount: 0, impressions: 0 },
        { _id: '4', title: 'Championship Finals', image: 'https://picsum.photos/800/403', position: 'tournament', isActive: true, order: 0, clickCount: 2100, impressions: 25000 },
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await bannerService.getAllBannersAnalytics()
      setAnalytics(response.data || [])
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setAnalytics(banners.map(b => ({
        title: b.title,
        impressions: b.impressions || Math.floor(Math.random() * 10000),
        clicks: b.clickCount || Math.floor(Math.random() * 500),
        ctr: '0%'
      })))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedBanner) {
        await bannerService.updateBanner(selectedBanner._id, formData)
      } else {
        await bannerService.createBanner(formData)
      }
      setShowModal(false)
      setSelectedBanner(null)
      resetForm()
      fetchBanners()
    } catch (error) {
      console.error('Error saving banner:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await bannerService.deleteBanner(id)
        fetchBanners()
      } catch (error) {
        console.error('Error deleting banner:', error)
      }
    }
  }

  const handleToggle = async (banner) => {
    try {
      await bannerService.toggleBannerStatus(banner._id)
      fetchBanners()
    } catch (error) {
      console.error('Error toggling banner:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      videoUrl: '',
      gifUrl: '',
      link: '',
      linkType: 'none',
      position: 'general',
      order: 0,
      size: { width: 1920, height: 500, aspectRatio: '16:9' },
      isActive: true,
      startDate: '',
      endDate: '',
      targetAudience: 'all'
    })
  }

  const openEditModal = (banner) => {
    setSelectedBanner(banner)
    setFormData({
      title: banner.title || '',
      description: banner.description || '',
      image: banner.image || '',
      videoUrl: banner.videoUrl || '',
      gifUrl: banner.gifUrl || '',
      link: banner.link || '',
      linkType: banner.linkType || 'none',
      position: banner.position || 'general',
      order: banner.order || 0,
      size: banner.size || { width: 1920, height: 500, aspectRatio: '16:9' },
      isActive: banner.isActive,
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : '',
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : '',
      targetAudience: banner.targetAudience || 'all'
    })
    setShowModal(true)
  }

  const filteredBanners = banners.filter(banner => 
    banner.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-500 mt-1">Manage app banners, images, videos and GIFs</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAnalytics(true)}
            className="btn-secondary flex items-center gap-2"
          >
            <BarChart3 size={18} />
            Analytics
          </button>
          <button 
            onClick={() => {
              setSelectedBanner(null)
              resetForm()
              setShowModal(true)
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add Banner
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Image className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{banners.length}</p>
              <p className="text-sm text-gray-500">Total Banners</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{banners.filter(b => b.isActive).length}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{banners.filter(b => b.videoUrl).length}</p>
              <p className="text-sm text-gray-500">Videos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <FileImage className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{banners.filter(b => b.gifUrl).length}</p>
              <p className="text-sm text-gray-500">GIFs</p>
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
              placeholder="Search banners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Positions</option>
              {positions.map(pos => (
                <option key={pos.value} value={pos.value}>{pos.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : filteredBanners.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Image size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No banners found</p>
          </div>
        ) : (
          filteredBanners.map((banner) => (
            <div key={banner._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative h-40 bg-gray-100">
                <img 
                  src={banner.image || 'https://via.placeholder.com/800x400'} 
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => handleToggle(banner)}
                    className={`p-2 rounded-lg ${banner.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
                  >
                    {banner.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                {!banner.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-medium">Inactive</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{banner.title}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {banner.position}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  Order: {banner.order} • Clicks: {banner.clickCount || 0}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(banner)}
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedBanner ? 'Edit Banner' : 'Create Banner'}
                </h2>
                <button 
                  onClick={() => {
                    setShowModal(false)
                    setSelectedBanner(null)
                    resetForm()
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                  <button type="button" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                    <Upload size={20} />
                  </button>
                </div>
              </div>

              {/* Video & GIF */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://example.com/video.mp4"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GIF URL</label>
                  <input
                    type="url"
                    value={formData.gifUrl}
                    onChange={(e) => setFormData({ ...formData, gifUrl: e.target.value })}
                    placeholder="https://example.com/animation.gif"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Position & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {positions.map(pos => (
                      <option key={pos.value} value={pos.value}>{pos.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Size Settings */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                  <input
                    type="number"
                    value={formData.size.width}
                    onChange={(e) => setFormData({ ...formData, size: { ...formData.size, width: parseInt(e.target.value) } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                  <input
                    type="number"
                    value={formData.size.height}
                    onChange={(e) => setFormData({ ...formData, size: { ...formData.size, height: parseInt(e.target.value) } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aspect Ratio</label>
                  <select
                    value={formData.size.aspectRatio}
                    onChange={(e) => setFormData({ ...formData, size: { ...formData.size, aspectRatio: e.target.value } })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {aspectRatios.map(ratio => (
                      <option key={ratio.value} value={ratio.value}>{ratio.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                <div className="flex gap-2">
                  <select
                    value={formData.linkType}
                    onChange={(e) => setFormData({ ...formData, linkType: e.target.value })}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="none">No Link</option>
                    <option value="internal">Internal</option>
                    <option value="external">External</option>
                  </select>
                  {formData.linkType !== 'none' && (
                    <input
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      placeholder="https://example.com"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Users</option>
                  <option value="players">Players Only</option>
                  <option value="teams">Teams Only</option>
                  <option value="admins">Admins Only</option>
                  <option value="guests">Guests Only</option>
                </select>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                  className={`flex items-center gap-2 ${formData.isActive ? 'text-green-600' : 'text-gray-400'}`}
                >
                  {formData.isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  <span className="font-medium">{formData.isActive ? 'Active' : 'Inactive'}</span>
                </button>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setSelectedBanner(null)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {selectedBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Banner Analytics</h2>
                <button 
                  onClick={() => setShowAnalytics(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Banner</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impressions</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTR</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {analytics.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{item.title}</td>
                        <td className="px-4 py-3 text-gray-500">{item.position}</td>
                        <td className="px-4 py-3 text-gray-900">{item.impressions?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-900">{item.clicks?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-green-600 font-medium">{item.ctr}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BannerManagement
