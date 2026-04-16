'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import Sidebar from '@/components/admin/Sidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import Toast from '@/components/admin/Toast';

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/berita': 'Berita',
  '/admin/dosen': 'Dosen',
  '/admin/galeri': 'Galeri',
  '/admin/pengumuman': 'Pengumuman',
  '/admin/kalender': 'Kalender',
  '/admin/alumni': 'Alumni',
  '/admin/struktur': 'Struktur Organisasi',
  '/admin/fasilitas': 'Fasilitas',
  '/admin/dokumen': 'Dokumen',
  '/admin/pesan': 'Pesan Masuk',
  '/admin/pengaturan': 'Pengaturan Situs',
};

function getPageTitle(pathname) {
  for (const [key, val] of Object.entries(pageTitles)) {
    if (pathname.startsWith(key)) return val;
  }
  return 'Admin';
}

function AdminLayoutInner({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [user, loading, isLoginPage, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!user) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ flex: 1, marginLeft: 'var(--sidebar-width)', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminHeader title={getPageTitle(pathname)} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main style={{ flex: 1, padding: 'var(--space-6)', background: 'var(--color-neutral-50)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
        <Toast />
      </ToastProvider>
    </AuthProvider>
  );
}
