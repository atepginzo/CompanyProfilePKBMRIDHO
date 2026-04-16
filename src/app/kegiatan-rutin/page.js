'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SITE_CONTENT } from '@/data/content';
import styles from '../program/unggulan/page.module.css';

export default function KegiatanRutinPage() {
  const { kegiatanRutin } = SITE_CONTENT;
  const [selected, setSelected] = useState(null);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Kelembagaan</p>
          <h1>Kegiatan Rutin</h1>
          <p>Membangun kebersamaan, kepedulian sosial, dan penguatan nilai-nilai religius di PKBM RIDHO.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {kegiatanRutin.map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.cardImage}>
                  <Image src={item.gambar} alt={item.nama} width={600} height={340} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  <div className={styles.cardOverlay} />
                </div>
                <div className={styles.cardBody}>
                  <h2>{item.nama}</h2>
                  <span style={{ display: 'inline-block', padding: '4px 12px', background: '#e0e7ff', color: '#4338ca', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>{item.waktu}</span>
                  <p>{item.deskripsi}</p>
                  <button className={styles.detailBtn} onClick={() => setSelected(item)}>
                    Baca Selengkapnya
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selected && (
        <div className={styles.modalBackdrop} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelected(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <div className={styles.modalImage}>
              <Image src={selected.gambar} alt={selected.nama} width={800} height={400} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            </div>
            <div className={styles.modalBody}>
              <h2>{selected.nama}</h2>
              <span style={{ display: 'inline-block', padding: '4px 14px', background: '#e0e7ff', color: '#4338ca', borderRadius: '20px', fontSize: '13px', fontWeight: 600, marginBottom: '14px' }}>{selected.waktu}</span>
              <p className={styles.modalDesc}>{selected.detail}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
