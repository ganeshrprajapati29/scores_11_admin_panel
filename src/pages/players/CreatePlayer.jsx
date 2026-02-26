import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { playersAPI } from '../../services/api'
import toast from 'react-hot-toast'

const CreatePlayer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!id)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'batsman',
    team: '',
    isActive: true
  })

  useEffect(() => {
    if (id) {
      fetchPlayer()
    }
  }, [id])

  const fetchPlayer = async () => {
    try {
      setInitialLoading(true)
      const response = await playersAPI.getById(id)
      setFormData({
        name: response.data?.name || '',
        email: response.data?.email || '',
        phone: response.data?.phone || '',
        role: response.data?.role || 'batsman',
        team: response.data?.team?._id || '',
        isActive: response.data?.isActive ?? true
      })
    } catch (error) {
      toast.error('Failed to fetch player')
      navigate('/players')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (id) {
        await playersAPI.update(id, formData)
        toast.success('Player updated successfully')
      } else {
        await playersAPI.create(formData)
        toast.success('Player created successfully')
      }
      navigate('/players')
    } catch (error) {
      toast.error(error.message || 'Failed to save player')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/players')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit Player' : 'Create Player'}</h1>
          <p className="text-gray-500 mt-1">{id ? 'Update player information' : 'Add a new player'}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input w-full" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="input w-full">
                <option value="batsman">Batsman</option>
                <option value="bowler">Bowler</option>
                <option value="all-rounder">All Rounder</option>
                <option value="wicket-keeper">Wicket Keeper</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={formData.isActive ? 'true' : 'false'} onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})} className="input w-full">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/players')} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
              <Save size={18} />
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePlayer
