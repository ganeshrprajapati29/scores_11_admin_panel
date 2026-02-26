import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { clubsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const CreateClub = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', shortName: '', city: '', country: '', founded: '', website: '', description: '' })

  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try { await clubsAPI.create(formData); toast.success('Club created'); navigate('/clubs'); } 
    catch (error) { toast.error('Failed') } 
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/clubs" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
        <div><h1 className="text-2xl font-bold text-gray-800">Create Club</h1></div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="input" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Short Name</label><input type="text" name="shortName" value={formData.shortName} onChange={handleChange} className="input" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">City</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="input" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Country</label><input type="text" name="country" value={formData.country} onChange={handleChange} className="input" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label><input type="number" name="founded" value={formData.founded} onChange={handleChange} className="input" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Website</label><input type="url" name="website" value={formData.website} onChange={handleChange} className="input" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="input" /></div>
          </div>
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
            <Link to="/clubs" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">{loading && <Loader2 className="animate-spin" size={18} />}{loading ? 'Creating...' : 'Create Club'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateClub
