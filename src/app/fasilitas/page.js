'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SITE_CONTENT } from '@/data/content';
import styles from './page.module.css';

export default function FasilitasPublikPage() {
  const { fasilitas } = SITE_CONTENT;
  const [selected, setSelected] = useState(null);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Profil Lembaga</p>
        <h1>Fasilitas Belajar</h1>
        <p>Sarana dan prasarana lengkap pendukung proses belajar dan pelatihan keterampilan di lingkungan PKBM RIDHO.</p>
      </section>

      <section className={styles.facilitySection}>
        <div className={styles.facilityGrid}>
          {fasilitas.map((item, index) => (
            <div key={index} className={styles.facilityCard} onClick={() => setSelected(item)}>
              <div className={styles.facilityImage}>
                <Image src={item.gambar} alt={item.nama} width={400} height={240} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                <div className={styles.facilityOverlay}>
                  <span>Lihat Detail</span>
                </div>
              </div>
              <div className={styles.facilityBody}>
                <h3>{item.nama}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detail Modal */}
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
              <p>{selected.deskripsi}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
