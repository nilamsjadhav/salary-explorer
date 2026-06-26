/**
 * Builds a URL with query params, skipping falsy values.
 * @param {string} path - The base path (e.g., "/api/employees")
 * @param {Object} params - Key-value pairs for query string
 * @returns {string} URL with query string
 */
export function buildUrl(path, params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `${path}?${queryString}` : path;
}
