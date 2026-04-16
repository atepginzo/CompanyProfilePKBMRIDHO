'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { publicAPI } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { DUMMY_GALERI } from '@/data/dummyData';
import styles from './page.module.css';

const PAGE_SIZE = 60;
const stripHtml = (value) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export default function GaleriPublikPage() {
  const [items, setItems] = useState(DUMMY_GALERI);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    publicAPI
      .getGaleriList(`page=1&limit=${PAGE_SIZE}`)
      .then((res) => {
        if (!mounted) return;
        const data = res.data || [];
        setItems(data.length > 0 ? data : DUMMY_GALERI);
      })
      .catch(() => {
        if (!mounted) return;
        setItems(DUMMY_GALERI);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Portal Publik</p>
        <h1>Galeri Kegiatan</h1>
        <p>Dokumentasi visual kegiatan akademik, prestasi, dan aktivitas PKBM RIDHO.</p>
      </section>

      <section className={styles.grid}>
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => <article key={index} className={styles.cardSkeleton} />)
        ) : (
          items.map((item) => (
            <article key={item.id} className={styles.card}>
              <Link href={`/galeri/${item.slug}`} className={styles.imageWrap}>
                {item.foto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.foto} alt={item.judulFoto} className={styles.image} />
                ) : (
                  <div className={styles.imageFallback}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  </div>
                )}
                <div className={styles.imageOverlay}>
                  <span>Lihat Detail</span>
                </div>
              </Link>

              <div className={styles.cardBody}>
                <div className={styles.metaRow}>
                  <span>{item.kategori?.nama || 'Umum'}</span>
                  <span>{formatDate(item.tanggalKegiatan || item.createdAt)}</span>
                </div>
                <h2>{item.judulFoto}</h2>
                <p>{stripHtml(item.keterangan).slice(0, 130)}{stripHtml(item.keterangan).length > 130 ? '...' : ''}</p>
              </div>
            </article>
          ))
        )}
      </section>

    </div>
  );
}
