import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Upload } from 'lucide-react'
import { blogsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const CreateBlog = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    thumbnail: null,
    status: 'draft'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) setFormData(prev => ({ ...prev, thumbnail: file }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          data.append(key, JSON.stringify(formData[key].split(',').map(t => t.trim())))
        } else if (formData[key]) {
          data.append(key, formData[key])
        }
      })
      await blogsAPI.create(data)
      toast.success('Blog created successfully')
      navigate('/blogs')
    } catch (error) {
      toast.error(error.message || 'Failed to create blog')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/blogs" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
        <div><h1 className="text-2xl font-bold text-gray-800">Create Blog</h1><p className="text-gray-500">Write a new blog post</p></div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Title *</label><input type="text" name="title" value={formData.title} onChange={handleChange} className="input" placeholder="Blog title" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Slug</label><input type="text" name="slug" value={formData.slug} onChange={handleChange} className="input" placeholder="blog-url-slug" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Content *</label><textarea name="content" value={formData.content} onChange={handleChange} rows={12} className="input" placeholder="Write your blog content here..." required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label><textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} className="input" placeholder="Short description" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Category</label><input type="text" name="category" value={formData.category} onChange={handleChange} className="input" placeholder="Category" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label><input type="text" name="tags" value={formData.tags} onChange={handleChange} className="input" placeholder="cricket, sports, ipl" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label><div className="flex items-center gap-4"><label className="cursor-pointer"><input type="file" accept="image/*" onChange={handleFileChange} className="hidden" /><div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"><Upload size={18} /><span>Upload</span></div></label>{formData.thumbnail && <span className="text-sm text-gray-500">{formData.thumbnail.name}</span>}</div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Status</label><select name="status" value={formData.status} onChange={handleChange} className="input"><option value="draft">Draft</option><option value="published">Published</option></select></div>
          </div>
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
            <Link to="/blogs" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">{loading && <Loader2 className="animate-spin" size={18} />}{loading ? 'Creating...' : 'Create Blog'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBlog
