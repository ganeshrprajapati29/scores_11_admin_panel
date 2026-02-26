import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, ScrollText, Trash2 } from 'lucide-react'
import { newsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const NewsList = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [search, setSearch] = useState('')

  useEffect(() => { fetchNews() }, [pagination.page, pagination.limit])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await newsAPI.getAll({ page: pagination.page, limit: pagination.limit, ...(search && { search }) })
      setNews(response.data || [])
      if (response.pagination) setPagination(prev => ({ ...prev, ...response.pagination }))
    } catch (error) { toast.error('Failed to fetch news') } 
    finally { setLoading(false) }
  }

  const handleSearch = (e) => { e.preventDefault(); setPagination(prev => ({ ...prev, page: 1 })); fetchNews() }
  const handleDelete = async (id) => { if (!window.confirm('Delete this news?')) return; try { await newsAPI.delete(id); toast.success('Deleted'); fetchNews(); } catch (error) { toast.error('Failed') } }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800">News</h1><p className="text-gray-500">Manage news articles</p></div>
        <Link to="/news/create" className="btn-primary"><Plus size={18} className="mr-2" />Create News</Link>
      </div>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="Search news..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10" /></div>
          <button type="submit" className="btn-secondary">Search</button>
        </form>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div></div> : news.length === 0 ? <div className="p-8 text-center"><ScrollText className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No news found</p></div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50"><tr><th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Title</th><th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Category</th><th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th><th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th><th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th></tr></thead>
              <tbody>{news.map((item) => (
                <tr key={item._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4"><div className="flex items-center gap-3">{item.thumbnail && <img src={item.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover" />}<div><p className="font-medium text-gray-800">{item.title}</p></div></div></td>
                  <td className="py-3 px-4 text-gray-600">{item.category || 'N/A'}</td>
                  <td className="py-3 px-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{item.status || 'draft'}</span></td>
                  <td className="py-3 px-4 text-gray-600">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td className="py-3 px-4"><button onClick={() => handleDelete(item._id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsList
