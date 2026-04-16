'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SITE_CONTENT } from '@/data/content';
import styles from './page.module.css';

export default function ProgramUnggulanPage() {
  const { programUnggulan } = SITE_CONTENT;
  const [selected, setSelected] = useState(null);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Program</p>
          <h1>Program Unggulan</h1>
          <p>Membekali peserta didik dengan keterampilan aplikatif dan kemandirian ekstra di luar kurikulum akademik.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {programUnggulan.map((program) => (
              <div key={program.id} className={styles.card}>
                <div className={styles.cardImage}>
                  <Image src={program.gambar} alt={program.nama} width={600} height={340} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                  <div className={styles.cardOverlay} />
                </div>
                <div className={styles.cardBody}>
                  <h2>{program.nama}</h2>
                  <p>{program.deskripsi}</p>
                  <button className={styles.detailBtn} onClick={() => setSelected(program)}>
                    Baca Selengkapnya
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
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
              <p className={styles.modalDesc}>{selected.detail}</p>
              <div className={styles.modalMeta}>
                {selected.jadwal && (
                  <div className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <div><strong>Jadwal</strong><span>{selected.jadwal}</span></div>
                  </div>
                )}
                {selected.pembimbing && (
                  <div className={styles.metaItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <div><strong>Pembimbing</strong><span>{selected.pembimbing}</span></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
