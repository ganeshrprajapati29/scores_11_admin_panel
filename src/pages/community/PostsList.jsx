import { useState, useEffect } from 'react'
import { Users, Trash2, Eye } from 'lucide-react'
import { communityAPI } from '../../services/api'
import toast from 'react-hot-toast'

const PostsList = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await communityAPI.getAllPosts({ limit: 50 })
      setPosts(response.data || [])
    } catch (error) { toast.error('Failed to fetch posts') } 
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return
    try { await communityAPI.deletePost(id); toast.success('Deleted'); fetchPosts(); } 
    catch (error) { toast.error('Failed') }
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-800">Community Posts</h1><p className="text-gray-500">Manage community posts</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div></div> : posts.length === 0 ? <div className="p-8 text-center"><Users className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No posts found</p></div> : (
          <div className="divide-y divide-gray-100">
            {posts.map((post) => (
              <div key={post._id} className="p-4 flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{post.content?.substring(0, 100)}...</p>
                  <p className="text-sm text-gray-500 mt-1">By {post.author?.name || 'Unknown'} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</p>
                </div>
                <div className="flex items-center gap-2">
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

export default PostsList
