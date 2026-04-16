'use client';

import { useEffect, useState } from 'react';
import { publicAPI } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import { DUMMY_KALENDER } from '@/data/dummyData';
import styles from './page.module.css';

const PAGE_SIZE = 60;

export default function KalenderPublikPage() {
  const [items, setItems] = useState(DUMMY_KALENDER);

  const getDateParts = (value) => {
    if (!value) return { day: '--', month: '---' };
    const date = new Date(value);
    return {
      day: String(date.getDate()).padStart(2, '0'),
      month: date.toLocaleString('id-ID', { month: 'short' }),
    };
  };

  useEffect(() => {
    let mounted = true;

    publicAPI
      .getKalender(`page=1&limit=${PAGE_SIZE}`)
      .then((res) => {
        if (!mounted) return;
        const data = res.data || [];
        setItems(data.length > 0 ? data : DUMMY_KALENDER);
      })
      .catch(() => {
        if (!mounted) return;
        setItems(DUMMY_KALENDER);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Portal Publik</p>
        <h1>Kalender Kegiatan</h1>
        <p>Agenda akademik dan non-akademik terbaru dari institusi.</p>
      </section>

      <section className={styles.timeline}>
        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>Belum ada event ditemukan</h3>
            <p>Belum ada agenda yang dipublikasikan.</p>
          </div>
        ) : (
          items.map((item) => (
            <article key={item.id} className={styles.eventCard}>
              <div className={styles.dateBlock} style={{ borderColor: item.warnaLabel || '#0f766e' }}>
                <strong>{getDateParts(item.tanggalMulai).day}</strong>
                <span>{getDateParts(item.tanggalMulai).month}</span>
              </div>
              <div className={styles.content}>
                <div className={styles.topRow}>
                  <span className={styles.badge}>{item.jenisEvent || 'umum'}</span>
                  <span className={styles.timeLabel}>{formatDateTime(item.tanggalMulai)}</span>
                </div>
                <h2>{item.judulEvent}</h2>
                {item.lokasi ? <p className={styles.location}>{item.lokasi}</p> : null}
                {item.deskripsi ? <p>{item.deskripsi}</p> : null}
                {item.tanggalSelesai ? <small>Selesai: {formatDateTime(item.tanggalSelesai)}</small> : null}
              </div>
            </article>
          ))
        )}
      </section>

    </div>
  );
}
