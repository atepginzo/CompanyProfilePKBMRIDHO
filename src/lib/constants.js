export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'PKBM RIDHO';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const ITEMS_PER_PAGE = 10;
export const ITEMS_PER_PAGE_PUBLIC = 9;

export const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

export const STATUS_AKTIF_OPTIONS = [
  { value: 'aktif', label: 'Aktif' },
  { value: 'nonaktif', label: 'Nonaktif' },
];

export const PRIORITAS_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'penting', label: 'Penting' },
  { value: 'urgent', label: 'Urgent' },
];

export const JENIS_EVENT_OPTIONS = [
  { value: 'akademik', label: 'Akademik' },
  { value: 'non_akademik', label: 'Non-Akademik' },
  { value: 'umum', label: 'Umum' },
];

export const VISIBILITAS_OPTIONS = [
  { value: 'publik', label: 'Publik' },
  { value: 'internal', label: 'Internal' },
];

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_DOC_TYPES = ['application/pdf'];
export const MAX_IMAGE_SIZE = parseInt(process.env.UPLOAD_MAX_SIZE_IMAGE) || 5242880;
export const MAX_DOC_SIZE = parseInt(process.env.UPLOAD_MAX_SIZE_DOCUMENT) || 10485760;

export const ADMIN_SIDEBAR_MENU = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'dashboard' },
  { label: 'Berita & Kegiatan', href: '/admin/berita', icon: 'newspaper' },
  { label: 'Pengumuman', href: '/admin/pengumuman', icon: 'announcement' },
  { label: 'Agenda & Kalender', href: '/admin/kalender', icon: 'calendar' },
  { label: 'Tenaga Pendidik', href: '/admin/dosen', icon: 'people' },
  { label: 'Alumni', href: '/admin/alumni', icon: 'school' },
  { label: 'Struktur Organisasi', href: '/admin/struktur', icon: 'org' },
  { label: 'Galeri', href: '/admin/galeri', icon: 'gallery' },
  { label: 'Fasilitas', href: '/admin/fasilitas', icon: 'building' },
  { label: 'Dokumen & Unduhan', href: '/admin/dokumen', icon: 'document' },
  { label: 'Pesan Masuk', href: '/admin/pesan', icon: 'mail' },
  { label: 'Pengaturan', href: '/admin/pengaturan', icon: 'settings' },
];
