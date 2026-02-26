import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import Modal from '../common/Modal'

const AwardForm = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    category: '',
    prize: '',
    year: '',
    winner: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Award' : 'Create Award'}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>
            {initialData ? 'Update' : 'Create'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Award Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter award name"
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter award description"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Best Player"
          />
          <Input
            label="Prize"
            name="prize"
            value={formData.prize}
            onChange={handleChange}
            placeholder="Enter prize details"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            placeholder="Enter year"
          />
          <Input
            label="Winner"
            name="winner"
            value={formData.winner}
            onChange={handleChange}
            placeholder="Enter winner name"
          />
        </div>
      </form>
    </Modal>
  )
}

export default AwardForm
