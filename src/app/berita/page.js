'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { publicAPI } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { DUMMY_BERITA } from '@/data/dummyData';
import styles from './page.module.css';

const PAGE_SIZE = 50;

const stripHtml = (value) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export default function BeritaPublikPage() {
  const [items, setItems] = useState(DUMMY_BERITA); // Instant render with dummy
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    publicAPI
      .getBeritaList(`page=1&limit=${PAGE_SIZE}`)
      .then((res) => {
        if (!mounted) return;
        const data = res.data || [];
        setItems(data.length > 0 ? data : DUMMY_BERITA);
      })
      .catch(() => {
        if (!mounted) return;
        setItems(DUMMY_BERITA);
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
        <h1>Berita & Kegiatan</h1>
        <p>
          Ikuti perkembangan akademik, kegiatan peserta didik, dan capaian terbaru PKBM RIDHO.
        </p>
      </section>

      <section className={styles.grid}>
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <article key={index} className={styles.cardSkeleton} />
          ))
        ) : (
          items.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.coverWrap}>
                {item.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.thumbnail} alt={item.judul} className={styles.cover} />
                ) : (
                  <div className={styles.coverFallback}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg>
                  </div>
                )}
              </div>

              <div className={styles.cardBody}>
                <div className={styles.metaRow}>
                  <span>{item.kategori?.nama || 'Umum'}</span>
                  <span>{formatDate(item.tanggalPublikasi || item.createdAt)}</span>
                </div>

                <h2>{item.judul}</h2>
                <p>{stripHtml(item.ringkasan).slice(0, 170)}{stripHtml(item.ringkasan).length > 170 ? '...' : ''}</p>

                <div className={styles.cardFooter}>
                  <span>{item.viewsCount || 0} views</span>
                  <Link href={`/berita/${item.slug}`} className={styles.readMore}>
                    Baca selengkapnya
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

    </div>
  );
}
