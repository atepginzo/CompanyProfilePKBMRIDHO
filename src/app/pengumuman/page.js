'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { publicAPI } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { DUMMY_PENGUMUMAN } from '@/data/dummyData';
import styles from './page.module.css';

const PAGE_SIZE = 50;
const stripHtml = (value) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export default function PengumumanPublikPage() {
  const [items, setItems] = useState(DUMMY_PENGUMUMAN);
  const featured = items[0] || null;
  const others = items.slice(1);

  useEffect(() => {
    let mounted = true;

    publicAPI
      .getPengumumanList(`page=1&limit=${PAGE_SIZE}`)
      .then((res) => {
        if (!mounted) return;
        const data = res.data || [];
        setItems(data.length > 0 ? data : DUMMY_PENGUMUMAN);
      })
      .catch(() => {
        if (!mounted) return;
        setItems(DUMMY_PENGUMUMAN);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Portal Publik</p>
        <h1>Pengumuman Resmi</h1>
        <p>Informasi penting terkait kebijakan akademik, agenda resmi, dan pengumuman layanan.</p>
      </section>

      <section className={styles.layout}>
        {featured ? (
          <article className={styles.featured}>
            <div className={styles.featuredTop}>
              <span className={`${styles.badge} ${styles[featured.prioritas] || ''}`}>{featured.prioritas || 'normal'}</span>
              <span className={styles.itemDate}>{formatDate(featured.tanggalBerlakuMulai || featured.createdAt)}</span>
            </div>
            <h2>{featured.judul}</h2>
            <p>
              {stripHtml(featured.konten).slice(0, 320)}
              {stripHtml(featured.konten).length > 320 ? '...' : ''}
            </p>
            <Link href={`/pengumuman/${featured.slug}`} className={styles.readMore}>Baca pengumuman utama</Link>
          </article>
        ) : (
          <div className={styles.emptyState}>
            <h3>Belum ada pengumuman</h3>
            <p>Pengumuman resmi akan muncul di halaman ini.</p>
          </div>
        )}

        <div className={styles.sideList}>
          {others.map((item) => (
            <article key={item.id} className={styles.itemCompact}>
              <div className={styles.itemTop}>
                <span className={`${styles.badge} ${styles[item.prioritas] || ''}`}>{item.prioritas || 'normal'}</span>
                <span className={styles.itemDate}>{formatDate(item.tanggalBerlakuMulai || item.createdAt)}</span>
              </div>
              <h3>{item.judul}</h3>
              <p>{stripHtml(item.konten).slice(0, 120)}{stripHtml(item.konten).length > 120 ? '...' : ''}</p>
              <Link href={`/pengumuman/${item.slug}`} className={styles.readMore}>Detail</Link>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
