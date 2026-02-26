import { useState, useEffect } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { communityAPI } from '../../services/api'
import toast from 'react-hot-toast'

const ReportedPosts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await communityAPI.getReportedPosts({ limit: 50 })
      setPosts(response.data || [])
    } catch (error) { toast.error('Failed to fetch') } 
    finally { setLoading(false) }
  }

  const handleIgnore = async (id) => {
    try { await communityAPI.ignoreReport(id); toast.success('Ignored'); fetchPosts(); } 
    catch (error) { toast.error('Failed') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return
    try { await communityAPI.deleteReportedPost(id); toast.success('Deleted'); fetchPosts(); } 
    catch (error) { toast.error('Failed') }
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-800">Reported Posts</h1><p className="text-gray-500">Manage reported community posts</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div></div> : posts.length === 0 ? <div className="p-8 text-center"><AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No reported posts</p></div> : (
          <div className="divide-y divide-gray-100">
            {posts.map((post) => (
              <div key={post._id} className="p-4 flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{post.content?.substring(0, 100)}...</p>
                  <p className="text-sm text-red-500 mt-1">Reported: {post.reportReason || 'N/A'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleIgnore(post._id)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg">Ignore</button>
                  <button onClick={() => handleDelete(post._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportedPosts
