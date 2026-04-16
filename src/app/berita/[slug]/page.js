'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { publicAPI } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { DUMMY_BERITA } from '@/data/dummyData';
import styles from './page.module.css';

export default function DetailBeritaPage() {
  const params = useParams();

  // Try dummy data first for instant render
  const dummyItem = DUMMY_BERITA.find((b) => b.slug === params.slug);
  const [loading, setLoading] = useState(!dummyItem);
  const [error, setError] = useState('');
  const [item, setItem] = useState(dummyItem || null);

  useEffect(() => {
    let mounted = true;

    publicAPI
      .getBeritaDetail(params.slug)
      .then((res) => {
        if (!mounted) return;
        if (res.data) setItem(res.data);
        setError('');
      })
      .catch((err) => {
        if (!mounted) return;
        // If dummy item exists, keep showing it
        if (!dummyItem) setError(err.message || 'Berita tidak ditemukan');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [params.slug, dummyItem]);

  if (loading) {
    return <div className={styles.loading}>Memuat detail berita...</div>;
  }

  if (error || !item) {
    return (
      <div className={styles.errorWrap}>
        <h1>Berita tidak tersedia</h1>
        <p>{error || 'Konten yang Anda cari belum dipublikasikan.'}</p>
        <Link href="/berita" className="btn btn-secondary">
          Kembali ke Daftar Berita
        </Link>
      </div>
    );
  }

  return (
    <article className={styles.page}>
      <Link href="/berita" className={styles.backLink}>
        &larr; Kembali ke daftar berita
      </Link>

      <header className={styles.header}>
        <p className={styles.category}>{item.kategori?.nama || 'Umum'}</p>
        <h1>{item.judul}</h1>
        <p className={styles.meta}>
          {formatDate(item.tanggalPublikasi || item.createdAt)} - {item.penulis || 'Admin'} - {item.viewsCount || 0} views
        </p>
      </header>

      {item.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.thumbnail} alt={item.judul} className={styles.heroImage} />
      ) : null}

      <div className={styles.summary}>{item.ringkasan}</div>

      <section className={styles.content} dangerouslySetInnerHTML={{ __html: item.konten || '' }} />
    </article>
  );
}
