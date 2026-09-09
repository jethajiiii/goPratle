
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const request = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    // Use the server's message when available; fall back to HTTP status text.
    throw new Error(data.message || response.statusText);
  }

  return data;
};

export const postRequirement = (payload) =>
  request('/requirements', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getRequirement = (id) => request(`/requirements/${id}`);
