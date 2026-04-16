'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { publicAPI } from '@/lib/api';
import { formatDate } from '@/lib/format';
import styles from './page.module.css';

export default function DetailGaleriPage() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [item, setItem] = useState(null);

  useEffect(() => {
    let mounted = true;

    publicAPI
      .getGaleriDetail(params.slug)
      .then((res) => {
        if (!mounted) return;
        setItem(res.data || null);
        setError('');
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Galeri tidak ditemukan');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [params.slug]);

  if (loading) {
    return <div className={styles.loading}>Memuat detail galeri...</div>;
  }

  if (error || !item) {
    return (
      <div className={styles.errorWrap}>
        <h1>Galeri tidak tersedia</h1>
        <p>{error || 'Konten yang Anda cari belum dipublikasikan.'}</p>
        <Link href="/galeri" className="btn btn-secondary">Kembali ke Galeri</Link>
      </div>
    );
  }

  return (
    <article className={styles.page}>
      <Link href="/galeri" className={styles.backLink}>← Kembali ke galeri</Link>

      <header className={styles.header}>
        <p className={styles.category}>{item.kategori?.nama || 'Umum'}</p>
        <h1>{item.judulFoto}</h1>
        <p className={styles.meta}>{formatDate(item.tanggalKegiatan || item.createdAt)}</p>
      </header>

      {item.foto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.foto} alt={item.judulFoto} className={styles.heroImage} />
      ) : null}

      {item.keterangan ? <p className={styles.caption}>{item.keterangan}</p> : null}

      {item.linkGdrive ? (
        <a href={item.linkGdrive} target="_blank" rel="noreferrer" className="btn btn-primary">
          Buka Dokumentasi Tambahan
        </a>
      ) : null}
    </article>
  );
}
