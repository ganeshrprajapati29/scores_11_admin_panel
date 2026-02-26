import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Badge, Trash2 } from 'lucide-react'
import { associationsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const AssociationList = () => {
  const [associations, setAssociations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAssociations() }, [])

  const fetchAssociations = async () => {
    try {
      setLoading(true)
      const response = await associationsAPI.getAll({ limit: 50 })
      setAssociations(response.data || [])
    } catch (error) { toast.error('Failed to fetch') } 
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this association?')) return
    try { await associationsAPI.delete(id); toast.success('Deleted'); fetchAssociations(); } 
    catch (error) { toast.error('Failed') }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800">Associations</h1><p className="text-gray-500">Manage associations</p></div>
        <Link to="/associations/create" className="btn-primary"><Plus size={18} className="mr-2" />Create Association</Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div></div> : associations.length === 0 ? <div className="p-8 text-center"><Badge className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No associations found</p></div> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {associations.map((association) => (
              <div key={association._id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800">{association.name}</h3>
                <p className="text-sm text-gray-500">{association.country}</p>
                <button onClick={() => handleDelete(association._id)} className="mt-2 text-red-500 text-sm">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AssociationList
