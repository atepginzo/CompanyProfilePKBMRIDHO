const API_BASE = '/api';
const ADMIN_TIMEOUT_MS = 7000;

async function fetchAPI(endpoint, options = {}) {
  const { timeoutMs = 0, ...restOptions } = options;
  const url = `${API_BASE}${endpoint}`;
  const controller = timeoutMs > 0 ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => {
        controller.abort();
      }, timeoutMs)
    : null;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...restOptions.headers,
    },
    ...restOptions,
    ...(controller ? { signal: controller.signal } : {}),
  };

  // Jangan set Content-Type jika body adalah FormData
  if (restOptions.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const fallbackMessage = data?.message || `Request gagal (${response.status})`;
      throw {
        status: response.status,
        ...(data?.error || {}),
        message: data?.error?.message || fallbackMessage,
      };
    }

    return data ?? { success: true, data: null };
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw {
        status: 408,
        code: 'TIMEOUT',
        message: 'Permintaan terlalu lama. Menampilkan data cadangan.',
      };
    }
    throw error;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

const fastPublicGet = (endpoint) => fetchAPI(endpoint, { timeoutMs: 1500 });
const adminRequest = (endpoint, options = {}) => fetchAPI(endpoint, { timeoutMs: ADMIN_TIMEOUT_MS, ...options });

// Admin API helpers
export const adminAPI = {
  // Auth
  login: (body) => adminRequest('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => adminRequest('/auth/logout', { method: 'POST' }),
  me: () => adminRequest('/auth/me'),

  // Dashboard
  dashboard: () => adminRequest('/admin/dashboard'),

  // Generic CRUD
  getList: (resource, params = '') => adminRequest(`/admin/${resource}${params ? `?${params}` : ''}`),
  getOne: (resource, id) => adminRequest(`/admin/${resource}/${id}`),
  create: (resource, body) => {
    if (body instanceof FormData) {
      return adminRequest(`/admin/${resource}`, { method: 'POST', body });
    }
    return adminRequest(`/admin/${resource}`, { method: 'POST', body: JSON.stringify(body) });
  },
  update: (resource, id, body) => {
    if (body instanceof FormData) {
      return adminRequest(`/admin/${resource}/${id}`, { method: 'PUT', body });
    }
    return adminRequest(`/admin/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(body) });
  },
  delete: (resource, id) => adminRequest(`/admin/${resource}/${id}`, { method: 'DELETE' }),
  upload: ({ file, folder = 'umum', maxWidth, quality }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    if (maxWidth) formData.append('max_width', String(maxWidth));
    if (quality) formData.append('quality', String(quality));
    return adminRequest('/admin/upload', { method: 'POST', body: formData });
  },

  // Spesifik
  markMessageRead: (id) => adminRequest(`/admin/pesan/${id}`, { method: 'PATCH', body: JSON.stringify({ isRead: true }) }),
};

// Public API helpers
export const publicAPI = {
  getBeranda: () => fastPublicGet('/public/beranda'),
  getBeritaList: (params = '') => fastPublicGet(`/public/berita?${params}`),
  getBeritaDetail: (slug) => fastPublicGet(`/public/berita/${slug}`),
  getGaleriList: (params = '') => fastPublicGet(`/public/galeri?${params}`),
  getGaleriDetail: (slug) => fastPublicGet(`/public/galeri/${slug}`),
  getPengumumanList: (params = '') => fastPublicGet(`/public/pengumuman?${params}`),
  getPengumumanDetail: (slug) => fastPublicGet(`/public/pengumuman/${slug}`),
  getKalender: (params = '') => fastPublicGet(`/public/kalender?${params}`),
  getDosen: (params = '') => fastPublicGet(`/public/dosen?${params}`),
  getAlumni: (params = '') => fastPublicGet(`/public/alumni?${params}`),
  getStruktur: () => fastPublicGet('/public/struktur'),
  getFasilitas: (params = '') => fastPublicGet(`/public/fasilitas?${params}`),
  getDokumen: (params = '') => fastPublicGet(`/public/dokumen?${params}`),
  getPengaturan: () => fastPublicGet('/public/pengaturan'),
  kirimPesan: (body) => fetchAPI('/public/pesan', { method: 'POST', body: JSON.stringify(body) }),
};
