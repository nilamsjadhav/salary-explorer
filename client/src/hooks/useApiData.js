import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for fetching API data with loading/error states.
 * @param {Function} fetchFn - Function that returns a promise (the API call)
 * @param {Array} deps - Dependency array to re-trigger the fetch
 * @returns {{ data, loading, error, refetch }}
 */
function useApiData(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);

    fetchFn()
      .then((result) => setData(result))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export default useApiData;
