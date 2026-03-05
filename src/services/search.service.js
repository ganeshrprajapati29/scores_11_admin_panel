import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Global search service - searches across all entities
 */
export const searchAPI = {
  /**
   * Search across all entities
   * @param {string} query - Search query
   * @param {number} limit - Results per category
   * @returns {Promise} Search results
   */
  search: async (query, limit = 5) => {
    try {
      const response = await axios.get(`${API_URL}/search`, {
        params: { q: query, limit },
        headers: {
          'Content-Type': 'application/json',
          // Add auth token if available
          ...(localStorage.getItem('token') && {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          })
        }
      });
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }
};

export default searchAPI;
