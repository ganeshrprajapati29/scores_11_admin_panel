import api from './api';

const bannerService = {
  // Get all banners (admin)
  getAllBanners: async (params = {}) => {
    const response = await api.get('/banners', { params });
    return response.data;
  },

  // Get active banners by position (public)
  getActiveBanners: async (position = 'general') => {
    const response = await api.get(`/banners/public/${position}`);
    return response.data;
  },

  // Get banner by ID
  getBannerById: async (id) => {
    const response = await api.get(`/banners/${id}`);
    return response.data;
  },

  // Create banner
  createBanner: async (bannerData) => {
    const response = await api.post('/banners', bannerData);
    return response.data;
  },

  // Update banner
  updateBanner: async (id, bannerData) => {
    const response = await api.put(`/banners/${id}`, bannerData);
    return response.data;
  },

  // Delete banner
  deleteBanner: async (id) => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
  },

  // Toggle banner status
  toggleBannerStatus: async (id) => {
    const response = await api.patch(`/banners/${id}/toggle`);
    return response.data;
  },

  // Reorder banners
  reorderBanners: async (position, orderedIds) => {
    const response = await api.post('/banners/reorder', { position, orderedIds });
    return response.data;
  },

  // Get banner analytics
  getBannerAnalytics: async (id) => {
    const response = await api.get(`/banners/${id}/analytics`);
    return response.data;
  },

  // Get all banners analytics
  getAllBannersAnalytics: async () => {
    const response = await api.get('/banners/analytics');
    return response.data;
  },

  // Record banner click
  recordBannerClick: async (id) => {
    const response = await api.post(`/banners/${id}/click`);
    return response.data;
  }
};

export default bannerService;
