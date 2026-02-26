import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, Plus, FileText, User, Calendar, 
  Eye, Heart, MessageCircle, Trash2, Edit, 
  EyeOff, Globe, Archive, MoreVertical, Filter, Tag
} from 'lucide-react'
import { blogsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const BlogList = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchBlogs()
  }, [pagination.page, pagination.limit, filters.status, filters.category])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.category && { category: filters.category })
      }
      const response = await blogsAPI.getAll(params)
      setBlogs(response.data || [])
      if (response.pagination) {
        setPagination(prev => ({ ...prev, ...response.pagination }))
      }
    } catch (error) {
      toast.error('Failed to fetch blogs')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchBlogs()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return
    try {
      await blogsAPI.delete(id)
      toast.success('Blog deleted successfully')
      fetchBlogs()
    } catch (error) {
      toast.error(error.message || 'Failed to delete blog')
    }
  }

  const handlePublish = async (id) => {
    try {
      await blogsAPI.publish(id)
      toast.success('Blog published successfully')
      fetchBlogs()
    } catch (error) {
      toast.error(error.message || 'Failed to publish blog')
    }
  }

  const handleUnpublish = async (id) => {
    try {
      await blogsAPI.unpublish(id)
      toast.success('Blog unpublished successfully')
      fetchBlogs()
    } catch (error) {
      toast.error(error.message || 'Failed to unpublish blog')
    }
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'published':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: Globe, label: 'Published' }
      case 'draft':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: FileText, label: 'Draft' }
      case 'archived':
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: Archive, label: 'Archived' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: FileText, label: status }
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'cricket': return 'bg-blue-100 text-blue-700'
      case 'tournament': return 'bg-purple-100 text-purple-700'
      case 'player': return 'bg-green-100 text-green-700'
      case 'team': return 'bg-orange-100 text-orange-700'
      case 'interview': return 'bg-pink-100 text-pink-700'
      case 'analysis': return 'bg-cyan-100 text-cyan-700'
      case 'news': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-500 mt-1">Manage your blog posts and articles</p>
        </div>
        <Link to="/blogs/create" className="btn-primary inline-flex items-center gap-2">
          <Plus size={18} />
          Create Blog
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Blogs</p>
              <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Published</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogs.filter(b => b.status === 'published').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogs.filter(b => b.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {blogs.reduce((acc, b) => acc + (b.views || 0), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search blogs by title..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="input pl-10 w-full"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Filter size={18} />
            Filters
          </button>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="input w-40"
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="input w-40"
              >
                <option value="">All Categories</option>
                <option value="cricket">Cricket</option>
                <option value="tournament">Tournament</option>
                <option value="player">Player</option>
                <option value="team">Team</option>
                <option value="interview">Interview</option>
                <option value="analysis">Analysis</option>
                <option value="news">News</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-5">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))
        ) : blogs.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No blogs found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          blogs.map((blog) => {
            const statusConfig = getStatusConfig(blog.status)
            const StatusIcon = statusConfig.icon

            return (
              <div key={blog._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                {/* Image */}
                <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: blog.image?.url ? `url(${blog.image.url})` : 'none' }}>
                  {blog.image?.url ? (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-white/50" />
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {blog.featured && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 ${statusConfig.bg} ${statusConfig.text} text-xs font-medium rounded-full flex items-center gap-1`}>
                      <StatusIcon size={12} />
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Category */}
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-2 py-1 ${getCategoryColor(blog.category)} text-xs font-medium rounded-full`}>
                      {blog.category?.charAt(0).toUpperCase() + blog.category?.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{blog.title}</h3>
                  
                  {blog.excerpt && (
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
                  )}

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {blog.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{blog.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{blog.author?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-1">
                      <Eye size={14} className="text-blue-500" />
                      <span>{blog.views?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart size={14} className="text-red-500" />
                      <span>{blog.likes?.length?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={14} className="text-green-500" />
                      <span>{blog.comments?.length?.toLocaleString() || 0}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/blogs/${blog._id}`}
                      className="flex-1 btn-secondary text-center text-sm py-2 flex items-center justify-center gap-1"
                    >
                      <Eye size={14} />
                      View
                    </Link>
                    {blog.status === 'draft' ? (
                      <button
                        onClick={() => handlePublish(blog._id)}
                        className="flex-1 btn-primary text-center text-sm py-2 flex items-center justify-center gap-1"
                      >
                        <Globe size={14} />
                        Publish
                      </button>
                    ) : blog.status === 'published' ? (
                      <button
                        onClick={() => handleUnpublish(blog._id)}
                        className="flex-1 btn-secondary text-center text-sm py-2 flex items-center justify-center gap-1"
                      >
                        <EyeOff size={14} />
                        Unpublish
                      </button>
                    ) : null}
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} blogs
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogList
