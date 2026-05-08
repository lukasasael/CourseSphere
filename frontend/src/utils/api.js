export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`http://localhost:3000${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errMsg = 'Falha na requisição. Verifique os dados e tente novamente.';
    if (Array.isArray(errorData.errors)) {
      errMsg = errorData.errors.join('\n');
    } else if (typeof errorData.errors === 'string') {
      errMsg = errorData.errors;
    } else if (errorData.error) {
      errMsg = errorData.error;
    }
    throw new Error(errMsg);
  }

  // Handle empty responses (like 204 No Content)
  if (response.status === 204) return null;
  
  return response.json();
}
