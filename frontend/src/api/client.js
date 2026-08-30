const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

class ApiRequestError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const contentType = res.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await res.json() : null;

  if (!res.ok) {
    throw new ApiRequestError(body?.message || `Request failed with status ${res.status}`, res.status, body);
  }
  return body;
}

export function getLoanSchemes() {
  return request('/loan-schemes');
}

export function submitLead(payload) {
  return request('/leads/submit', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getLeads() {
  return request('/leads');
}

export { ApiRequestError };
