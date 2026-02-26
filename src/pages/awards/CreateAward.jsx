import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { awardsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const CreateAward = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', category: '', description: '', prize: '' })

  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try { await awardsAPI.create(formData); toast.success('Award created'); navigate('/awards'); } 
    catch (error) { toast.error('Failed') } 
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/awards')} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></button>
        <div><h1 className="text-2xl font-bold text-gray-800">Create Award</h1></div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="input" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Category</label><input type="text" name="category" value={formData.category} onChange={handleChange} className="input" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Prize</label><input type="text" name="prize" value={formData.prize} onChange={handleChange} className="input" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="input" /></div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => navigate('/awards')} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">{loading && <Loader2 className="animate-spin" size={18} />}Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAward
