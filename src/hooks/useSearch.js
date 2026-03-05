import { useState, useCallback, useEffect } from 'react';
import useDebounce from './useDebounce';

/**
 * Custom hook for handling search with debouncing
 * @param {Function} fetchFunction - Function to call for fetching data
 * @param {Object} initialParams - Initial parameters for the fetch function
 * @param {number} debounceDelay - Delay in milliseconds (default: 300ms)
 * @returns {Object} Search state and handlers
 */
const useSearch = (fetchFunction, initialParams = {}, debounceDelay = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Debounce the search term
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  // Fetch data when debounced search term changes
  const fetchData = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchFunction({
        ...initialParams,
        ...params,
        search: debouncedSearchTerm || params.search || ''
      });

      // Handle different response structures
      const data = response.data?.data || response.data || response;
      const items = Array.isArray(data) ? data : (data.users || data.teams || data || []);
      const paginationData = response.data?.pagination || response.pagination || {};

      setResults(items);
      setPagination(prev => ({
        ...prev,
        ...paginationData,
        total: paginationData.total || items.length || 0,
        pages: paginationData.pages || Math.ceil((paginationData.total || items.length) / (paginationData.limit || 10))
      }));
    } catch (err) {
      setError(err.message || 'An error occurred while searching');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, initialParams, debouncedSearchTerm]);

  // Trigger fetch when debounced search term changes
  useEffect(() => {
    fetchData();
  }, [debouncedSearchTerm]);

  // Search handler
  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on new search
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setResults([]);
    setError(null);
  }, []);

  // Refresh data
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Change page
  const changePage = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
    fetchData({ page });
  }, [fetchData]);

  return {
    searchTerm,
    results,
    loading,
    error,
    pagination,
    handleSearch,
    clearSearch,
    refresh,
    changePage,
    setResults,
    setPagination
  };
};

export default useSearch;
