import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Upload } from 'lucide-react'
import { storeAPI } from '../../services/api'
import toast from 'react-hot-toast'

const AddProduct = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', category: '', image: null })

  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })) }
  const handleFileChange = (e) => { const file = e.target.files[0]; if (file) setFormData(prev => ({ ...prev, image: file })) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => { if (formData[key]) data.append(key, formData[key]) })
      await storeAPI.createProduct(data)
      toast.success('Product added')
      navigate('/store/products')
    } catch (error) { toast.error('Failed') } 
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/store/products" className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft size={20} /></Link>
        <div><h1 className="text-2xl font-bold text-gray-800">Add Product</h1></div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="input" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Price *</label><input type="number" name="price" value={formData.price} onChange={handleChange} className="input" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Stock</label><input type="number" name="stock" value={formData.stock} onChange={handleChange} className="input" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Category</label><input type="text" name="category" value={formData.category} onChange={handleChange} className="input" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="input" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Image</label><div className="flex items-center gap-4"><label className="cursor-pointer"><input type="file" accept="image/*" onChange={handleFileChange} className="hidden" /><div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"><Upload size={18} /><span>Upload</span></div></label></div></div>
          </div>
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
            <Link to="/store/products" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">{loading && <Loader2 className="animate-spin" size={18} />}{loading ? 'Adding...' : 'Add Product'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProduct
