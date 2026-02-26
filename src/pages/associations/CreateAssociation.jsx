import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { associationsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const CreateAssociation = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', country: '', description: '' })

  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try { await associationsAPI.create(formData); toast.success('Association created'); navigate('/associations'); } 
    catch (error) { toast.error('Failed') } 
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/associations" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
        <div><h1 className="text-2xl font-bold text-gray-800">Create Association</h1></div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="input" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Country</label><input type="text" name="country" value={formData.country} onChange={handleChange} className="input" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="input" /></div>
          </div>
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
            <Link to="/associations" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">{loading && <Loader2 className="animate-spin" size={18} />}{loading ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAssociation
