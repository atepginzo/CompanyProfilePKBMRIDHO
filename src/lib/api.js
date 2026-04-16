const API_BASE = '/api';

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
    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        ...data.error,
      };
    }

    return data;
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

// Admin API helpers
export const adminAPI = {
  // Auth
  login: (body) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),
  me: () => fetchAPI('/auth/me'),

  // Dashboard
  dashboard: () => fetchAPI('/admin/dashboard'),

  // Generic CRUD
  getList: (resource, params = '') => fetchAPI(`/admin/${resource}?${params}`),
  getOne: (resource, id) => fetchAPI(`/admin/${resource}/${id}`),
  create: (resource, body) => {
    if (body instanceof FormData) {
      return fetchAPI(`/admin/${resource}`, { method: 'POST', body });
    }
    return fetchAPI(`/admin/${resource}`, { method: 'POST', body: JSON.stringify(body) });
  },
  update: (resource, id, body) => {
    if (body instanceof FormData) {
      return fetchAPI(`/admin/${resource}/${id}`, { method: 'PUT', body });
    }
    return fetchAPI(`/admin/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(body) });
  },
  delete: (resource, id) => fetchAPI(`/admin/${resource}/${id}`, { method: 'DELETE' }),
  upload: ({ file, folder = 'umum', maxWidth, quality }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    if (maxWidth) formData.append('max_width', String(maxWidth));
    if (quality) formData.append('quality', String(quality));
    return fetchAPI('/admin/upload', { method: 'POST', body: formData });
  },

  // Spesifik
  markMessageRead: (id) => fetchAPI(`/admin/pesan/${id}/read`, { method: 'PATCH', body: JSON.stringify({ isRead: true }) }),
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
