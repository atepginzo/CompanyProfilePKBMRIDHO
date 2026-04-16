'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { publicAPI } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { DUMMY_PENGUMUMAN } from '@/data/dummyData';
import styles from './page.module.css';

export default function DetailPengumumanPage() {
  const params = useParams();

  const dummyItem = DUMMY_PENGUMUMAN.find((p) => p.slug === params.slug);
  const [loading, setLoading] = useState(!dummyItem);
  const [error, setError] = useState('');
  const [item, setItem] = useState(dummyItem || null);

  useEffect(() => {
    let mounted = true;

    publicAPI
      .getPengumumanDetail(params.slug)
      .then((res) => {
        if (!mounted) return;
        if (res.data) setItem(res.data);
        setError('');
      })
      .catch((err) => {
        if (!mounted) return;
        if (!dummyItem) setError(err.message || 'Pengumuman tidak ditemukan');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [params.slug, dummyItem]);

  const period = useMemo(() => {
    if (!item) return '-';
    if (!item.tanggalBerlakuMulai && !item.tanggalBerlakuSelesai) return '-';
    const start = item.tanggalBerlakuMulai ? formatDate(item.tanggalBerlakuMulai) : '-';
    const end = item.tanggalBerlakuSelesai ? formatDate(item.tanggalBerlakuSelesai) : '-';
    return `${start} s.d. ${end}`;
  }, [item]);

  if (loading) {
    return <div className={styles.loading}>Memuat detail pengumuman...</div>;
  }

  if (error || !item) {
    return (
      <div className={styles.errorWrap}>
        <h1>Pengumuman tidak tersedia</h1>
        <p>{error || 'Konten yang Anda cari belum dipublikasikan.'}</p>
        <Link href="/pengumuman" className="btn btn-secondary">Kembali ke Pengumuman</Link>
      </div>
    );
  }

  return (
    <article className={styles.page}>
      <Link href="/pengumuman" className={styles.backLink}>&larr; Kembali ke daftar pengumuman</Link>

      <header className={styles.header}>
        <span className={`${styles.badge} ${styles[item.prioritas] || ''}`}>{item.prioritas || 'normal'}</span>
        <h1>{item.judul}</h1>
        <p className={styles.meta}>Dipublikasikan {formatDate(item.createdAt)}</p>
        <p className={styles.meta}>Periode berlaku: {period}</p>
      </header>

      <section className={styles.content} dangerouslySetInnerHTML={{ __html: item.konten || '' }} />

      {item.lampiran ? (
        <a href={item.lampiran} target="_blank" rel="noreferrer" className="btn btn-primary">
          Buka Lampiran
        </a>
      ) : null}
    </article>
  );
}
