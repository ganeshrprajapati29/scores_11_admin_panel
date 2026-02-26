import { useState, useEffect } from 'react'
import { Plus, Award, Trash2 } from 'lucide-react'
import { awardsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const AwardsList = () => {
  const [awards, setAwards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAwards() }, [])

  const fetchAwards = async () => {
    try {
      setLoading(true)
      const response = await awardsAPI.getAll({ limit: 50 })
      setAwards(response.data || [])
    } catch (error) { toast.error('Failed to fetch') } 
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this award?')) return
    try { await awardsAPI.delete(id); toast.success('Deleted'); fetchAwards(); } 
    catch (error) { toast.error('Failed') }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800">Awards</h1><p className="text-gray-500">Manage awards</p></div>
        <button className="btn-primary"><Plus size={18} className="mr-2" />Create Award</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div></div> : awards.length === 0 ? <div className="p-8 text-center"><Award className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No awards found</p></div> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {awards.map((award) => (
              <div key={award._id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800">{award.name}</h3>
                <p className="text-sm text-gray-500">{award.category}</p>
                <button onClick={() => handleDelete(award._id)} className="mt-2 text-red-500 text-sm">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AwardsList
