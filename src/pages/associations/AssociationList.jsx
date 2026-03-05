import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Badge, Trash2, Eye, MapPin, Users, Trophy } from 'lucide-react'
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Associations</h1>
          <p className="text-gray-500">Manage associations</p>
        </div>
        <Link to="/associations/create" className="btn-primary">
          <Plus size={18} className="mr-2" />Create Association
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Badge className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Associations</p>
              <p className="text-2xl font-bold text-gray-900">{associations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Associations</p>
              <p className="text-2xl font-bold text-gray-900">
                {associations.filter(a => a.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Verified</p>
              <p className="text-2xl font-bold text-gray-900">
                {associations.filter(a => a.isVerified).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : associations.length === 0 ? (
          <div className="p-8 text-center">
            <Badge className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No associations found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {associations.map((association) => (
              <div key={association._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {association.logo?.url ? (
                        <img src={association.logo.url} alt={association.name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                          {association.name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-800">{association.name}</h3>
                        {association.shortName && (
                          <p className="text-sm text-gray-500">{association.shortName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      {association.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin size={14} />
                          {[association.location.city, association.location.state, association.location.country].filter(Boolean).join(', ') || 'Location not specified'}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          association.isVerified 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {association.isVerified ? '✓ Verified' : 'Pending'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          association.isActive 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {association.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Link
                    to={`/associations/${association._id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                  >
                    <Eye size={16} />
                    View Details
                  </Link>
                  <button 
                    onClick={() => handleDelete(association._id)} 
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AssociationList
