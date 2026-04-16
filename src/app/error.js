'use client';

import Link from 'next/link';
import styles from './error.module.css';

export default function ErrorPage({ error, reset }) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h1 className={styles.title}>Terjadi Kesalahan</h1>
        <p className={styles.desc}>
          {error?.message || 'Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.'}
        </p>
        <div className={styles.actions}>
          <button onClick={() => reset()} className="btn btn-primary btn-lg">
            Coba Lagi
          </button>
          <Link href="/" className="btn btn-secondary btn-lg">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
