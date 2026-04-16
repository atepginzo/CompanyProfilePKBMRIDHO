'use client';

import { useEffect, useState } from 'react';
import { publicAPI } from '@/lib/api';
import { formatDate, formatFileSize } from '@/lib/format';
import { DUMMY_DOKUMEN } from '@/data/dummyData';
import styles from './page.module.css';

const PAGE_SIZE = 60;
const stripHtml = (value) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export default function DokumenPublikPage() {
  const [items, setItems] = useState(DUMMY_DOKUMEN);

  useEffect(() => {
    let mounted = true;

    publicAPI
      .getDokumen(`page=1&limit=${PAGE_SIZE}`)
      .then((res) => {
        if (!mounted) return;
        const data = res.data || [];
        setItems(data.length > 0 ? data : DUMMY_DOKUMEN);
      })
      .catch(() => {
        if (!mounted) return;
        setItems(DUMMY_DOKUMEN);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Portal Publik</p>
        <h1>Dokumen Publik</h1>
        <p>Akses dokumen institusi yang tersedia untuk umum.</p>
      </section>

      <section className={styles.list}>
        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Belum ada dokumen tersedia</h3>
            <p>Dokumen publik belum tersedia saat ini.</p>
          </div>
        ) : (
          items.map((item) => (
            <article key={item.id} className={styles.item}>
              <div className={styles.itemHead}>
                <div className={styles.fileIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div className={styles.itemTop}>
                  <h2>{item.judulDokumen}</h2>
                  <span className={styles.fileType}>{item.tipeFile?.toUpperCase() || '-'}</span>
                </div>
              </div>
              {item.deskripsi ? <p>{stripHtml(item.deskripsi).slice(0, 200)}</p> : null}
              <div className={styles.meta}>
                <span>{item.kategori || 'Umum'}</span>
                <span>{formatFileSize(item.ukuranFile || 0)}</span>
                <span>{formatDate(item.createdAt)}</span>
              </div>
              <a href={item.filePath} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                Unduh / Lihat Dokumen
              </a>
            </article>
          ))
        )}
      </section>

    </div>
  );
}
