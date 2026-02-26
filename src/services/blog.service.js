import api from '../config/axiosConfig'

export const blogService = {
  getAllBlogs: async (params = {}) => {
    const response = await api.get('/blogs', { params })
    return response
  },

  getBlogById: async (id) => {
    const response = await api.get(`/blogs/${id}`)
    return response
  },

  createBlog: async (data) => {
    const response = await api.post('/blogs', data)
    return response
  },

  updateBlog: async (id, data) => {
    const response = await api.put(`/blogs/${id}`, data)
    return response
  },

  deleteBlog: async (id) => {
    const response = await api.delete(`/blogs/${id}`)
    return response
  },

  publishBlog: async (id) => {
    const response = await api.patch(`/blogs/${id}/publish`)
    return response
  },

  unpublishBlog: async (id) => {
    const response = await api.patch(`/blogs/${id}/unpublish`)
    return response
  }
}

export default blogService
