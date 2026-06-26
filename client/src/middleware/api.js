const BASE_URL = process.env.REACT_APP_API_URL || "";

class ApiError extends Error {
  constructor(status, statusText, body, endpoint) {
    super(`API error ${status}: ${body || statusText}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.body = body;
    this.endpoint = endpoint;
  }
}

async function request(endpoint, options = {}) {
  const { method = "GET", body, headers = {} } = options;

  const config = {
    method,
    headers: { ...headers },
  };

  if (body !== undefined) {
    config.headers["Content-Type"] = "application/json";
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new ApiError(response.status, response.statusText, errorBody, endpoint);
  }

  const contentType = response.headers.get("content-type");
  if (response.status === 204 || !contentType?.includes("application/json")) {
    return null;
  }

  return await response.json();
}

const api = {
  get: (endpoint) => request(endpoint, { method: "GET" }),
};

export { ApiError };
export default api;
