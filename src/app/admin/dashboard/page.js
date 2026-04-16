'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import { formatNumber, formatRelative } from '@/lib/format';
import styles from '@/styles/admin/dashboard.module.css';

const statConfig = [
  { key: 'totalBerita', label: 'Total Berita', color: '#6366F1', icon: 'newspaper' },
  { key: 'totalDosen', label: 'Total Dosen', color: '#8B5CF6', icon: 'people' },
  { key: 'totalGaleri', label: 'Total Galeri', color: '#EC4899', icon: 'gallery' },
  { key: 'totalAlumni', label: 'Total Alumni', color: '#14B8A6', icon: 'school' },
  { key: 'totalPengumuman', label: 'Pengumuman', color: '#F59E0B', icon: 'announcement' },
  { key: 'pesanBelumDibaca', label: 'Pesan Belum Dibaca', color: '#EF4444', icon: 'mail' },
  { key: 'totalDokumen', label: 'Total Dokumen', color: '#0EA5E9', icon: 'document' },
  { key: 'totalFasilitas', label: 'Total Fasilitas', color: '#10B981', icon: 'building' },
];

const quickActions = [
  { label: 'Tambah Berita', href: '/admin/berita/tambah', color: '#6366F1' },
  { label: 'Tambah Dosen', href: '/admin/dosen/tambah', color: '#8B5CF6' },
  { label: 'Upload Galeri', href: '/admin/galeri/tambah', color: '#EC4899' },
  { label: 'Buat Pengumuman', href: '/admin/pengumuman/tambah', color: '#F59E0B' },
  { label: 'Pengaturan', href: '/admin/pengaturan', color: '#64748B' },
];

const iconSVGs = {
  newspaper: <><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></>,
  people: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
  gallery: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
  school: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></>,
  announcement: <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>,
  mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
  document: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  building: <><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M8 10h.01M16 10h.01M12 14h.01M8 14h.01M16 14h.01"/></>,
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.dashboard()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        {statConfig.map((item) => (
          <div key={item.key} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: `${item.color}15`, color: item.color }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {iconSVGs[item.icon]}
              </svg>
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>
                {loading ? (
                  <div className="skeleton skeleton-text" style={{ width: '60px', height: '28px' }} />
                ) : (
                  formatNumber(stats?.[item.key] || 0)
                )}
              </span>
              <span className={styles.statLabel}>{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Aksi Cepat</h2>
        <div className={styles.actionsGrid}>
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className={styles.actionCard}>
              <div className={styles.actionIcon} style={{ background: `${action.color}15`, color: action.color }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
              <span className={styles.actionLabel}>{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {!loading && stats ? (
        <div className={styles.recentGrid}>
          {/* Recent Berita */}
          <div className={styles.recentCard}>
            <div className={styles.recentHeader}>
              <h3>Berita Terbaru</h3>
              <Link href="/admin/berita" className={styles.viewAll}>Lihat Semua</Link>
            </div>
            {(stats.recentBerita || []).length === 0 ? (
              <p className={styles.emptyRecent}>Belum ada berita.</p>
            ) : (
              <ul className={styles.recentList}>
                {stats.recentBerita.map((item) => (
                  <li key={item.id}>
                    <Link href={`/admin/berita/edit/${item.id}`} className={styles.recentItem}>
                      <span className={styles.recentTitle}>{item.judul}</span>
                      <span className={`${styles.recentBadge} ${item.status === 'published' ? styles.badgeSuccess : styles.badgeDefault}`}>
                        {item.status}
                      </span>
                      <span className={styles.recentTime}>{formatRelative(item.createdAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent Pesan */}
          <div className={styles.recentCard}>
            <div className={styles.recentHeader}>
              <h3>Pesan Masuk Terbaru</h3>
              <Link href="/admin/pesan" className={styles.viewAll}>Lihat Semua</Link>
            </div>
            {(stats.recentPesan || []).length === 0 ? (
              <p className={styles.emptyRecent}>Belum ada pesan.</p>
            ) : (
              <ul className={styles.recentList}>
                {stats.recentPesan.map((item) => (
                  <li key={item.id}>
                    <Link href={`/admin/pesan/edit/${item.id}`} className={styles.recentItem}>
                      <span className={styles.recentTitle}>
                        {!item.isRead ? <span className={styles.unreadDot} /> : null}
                        {item.namaPengirim}: {item.subjek}
                      </span>
                      <span className={styles.recentTime}>{formatRelative(item.createdAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
