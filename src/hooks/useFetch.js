import { useState, useEffect, useCallback } from 'react'

const useFetch = (fetchFn, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchFn(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err.message || 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, ...dependencies])

  const refetch = useCallback(() => {
    return execute()
  }, [execute])

  return {
    data,
    loading,
    error,
    execute,
    refetch,
  }
}

export default useFetch
