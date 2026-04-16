'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { publicAPI } from '@/lib/api';
import { DUMMY_BERITA, DUMMY_PENGUMUMAN } from '@/data/dummyData';
import styles from './page.module.css';

const stripHtml = (v) => String(v || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useCountUp(target, trigger, duration = 1200, startValue = 0) {
  const [value, setValue] = useState(startValue);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!trigger || hasRunRef.current) return;
    hasRunRef.current = true;

    const from = Number.isFinite(startValue) ? startValue : 0;
    const to = Number.isFinite(target) ? target : 0;
    const startAt = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [trigger, target, duration, startValue]);

  return value;
}

function AnimatedSection({ children, className, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}s, transform 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statsRef, statsVisible] = useInView(0.35);

  useEffect(() => {
    let mounted = true;
    publicAPI
      .getBeranda()
      .then((res) => { if (mounted) setData(res.data); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const s = data?.settings || {};
  const stats = data?.stats || {};
  const beritaRaw = data?.beritaTerbaru || [];
  const pengumumanRaw = data?.pengumumanAktif || [];

  // Fallback to dummy data if API returns empty
  const berita = beritaRaw.length > 0 ? beritaRaw : DUMMY_BERITA.slice(0, 3);
  const pengumuman = pengumumanRaw.length > 0 ? pengumumanRaw : DUMMY_PENGUMUMAN.slice(0, 3);

  const tahunBerdiriTarget = Number(String(s.tahun_berdiri || '2005').replace(/\D/g, '')) || 2005;
  const alumniTarget = Number(String(stats.totalAlumniSetting || stats.totalAlumniDB || '500').replace(/\D/g, '')) || 500;
  const dosenTarget = Number(String(stats.totalDosen || '15').replace(/\D/g, '')) || 15;

  const tahunBerdiriCount = useCountUp(tahunBerdiriTarget, statsVisible, 1300, Math.max(0, tahunBerdiriTarget - 80));
  const alumniCount = useCountUp(alumniTarget, statsVisible, 1500, 0);
  const dosenCount = useCountUp(dosenTarget, statsVisible, 1100, 0);

  return (
    <div className={styles.page}>

      {/* ===== 1. HERO SECTION ===== */}
      <section className={styles.hero}>
        <video
          className={styles.heroVideo}
          autoPlay
          muted
          loop
          playsInline
          poster="/gedung-ridho.jpg"
          aria-hidden="true"
        >
          <source src="https://cdn.coverr.co/videos/coverr-school-corridor-1579/1080p.mp4" type="video/mp4" />
        </video>
        <div className={styles.heroVideoOverlay} />
        <div className={styles.heroParticles}>
          <div className={styles.particle} style={{ left: '10%', top: '20%', animationDelay: '0s' }} />
          <div className={styles.particle} style={{ left: '80%', top: '30%', animationDelay: '2s' }} />
          <div className={styles.particle} style={{ left: '60%', top: '70%', animationDelay: '4s' }} />
          <div className={styles.particle} style={{ left: '25%', top: '60%', animationDelay: '1s' }} />
          <div className={styles.particle} style={{ left: '90%', top: '80%', animationDelay: '3s' }} />
        </div>
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>Pusat Kegiatan Belajar Masyarakat</span>
          <h1 className={styles.heroTitle}>
            {s.hero_headline || 'Wujudkan Pendidikan Setara untuk Semua'}
          </h1>
          <p className={styles.heroSub}>
            {s.hero_sub_headline || 'Belajar dalam suasana kampus yang hidup dengan program Paket A, B, dan C gratis, fleksibel, dan diakui resmi pemerintah.'}
          </p>
          <div className={styles.heroCta}>
            <Link href="/pendaftaran" className="btn btn-primary btn-lg">Daftar Sekarang Gratis</Link>
            <Link href="/profil" className="btn btn-secondary btn-lg">Kenali PKBM RIDHO</Link>
          </div>
        </div>
      </section>

      {/* ===== 2. STATISTIK RINGKAS + GRATIS ===== */}
      <section ref={statsRef} className={styles.statsSection}>
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <strong>{tahunBerdiriCount}</strong>
            <span>Tahun Berdiri</span>
          </div>
          <div className={styles.statItem}>
            <strong>{alumniCount}+</strong>
            <span>Alumni Lulus</span>
          </div>
          <div className={styles.statItem}>
            <strong>{dosenCount}</strong>
            <span>Tenaga Pendidik</span>
          </div>
          <div className={`${styles.statItem} ${styles.statHighlight}`}>
            <strong>GRATIS</strong>
            <span>Biaya Pendidikan</span>
          </div>
        </div>
      </section>

      {/* ===== 3. LEGALITAS & PENGAKUAN ===== */}
      <AnimatedSection>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.legalSection}>
              <div className={styles.legalIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
              </div>
              <div className={styles.legalContent}>
                <h2>Lembaga Resmi & Diakui Pemerintah</h2>
                <p>
                  PKBM RIDHO adalah lembaga pendidikan nonformal resmi yang menyelenggarakan program
                  kesetaraan Paket A, Paket B, dan Paket C. Ijazah yang diterbitkan
                  <strong> sah dan setara</strong> dengan ijazah pendidikan formal, serta dapat
                  digunakan untuk melanjutkan pendidikan ke jenjang lebih tinggi maupun melamar pekerjaan.
                </p>
              </div>
              <div className={styles.legalBadges}>
                <div className={styles.legalBadge}>
                  <span className={styles.badgeIcon}>&#10003;</span>
                  <a href="https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/P2960528" target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>Izin Operasional Resmi</a>
                </div>
                <div className={styles.legalBadge}>
                  <span className={styles.badgeIcon}>&#10003;</span>
                  <span>Akreditasi A</span>
                </div>
                <div className={styles.legalBadge}>
                  <span className={styles.badgeIcon}>&#10003;</span>
                  <a href="https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/P2960528" target="_blank" rel="noopener noreferrer" style={{color: 'inherit', textDecoration: 'none'}}>Terdaftar di Kemendikbud</a>
                </div>
                <div className={styles.legalBadge}>
                  <span className={styles.badgeIcon}>&#10003;</span>
                  <span>Pendidikan Gratis</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ===== 4. PROGRAM PENDIDIKAN ===== */}
      <AnimatedSection>
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Program Pendidikan</h2>
                <p className={styles.sectionSub}>Pilih program yang sesuai, semua gratis dan terbuka untuk umum.</p>
              </div>
              <Link href="/program/kesetaraan" className="btn btn-secondary">Lihat Semua Program</Link>
            </div>

            <div className={styles.programGrid}>
              <Link href="/program/kesetaraan#paket-a" className={styles.programCard}>
                <div className={styles.programIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
                </div>
                <h3>Paket A</h3>
                <span className={styles.programLevel}>Setara SD / MI</span>
                <p>Untuk warga yang belum menyelesaikan pendidikan dasar. Tersedia Program Reguler & Karyawan.</p>
                <span className={styles.programCta}>Pelajari Selengkapnya &#8594;</span>
              </Link>

              <Link href="/program/kesetaraan#paket-b" className={styles.programCard}>
                <div className={styles.programIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
                </div>
                <h3>Paket B</h3>
                <span className={styles.programLevel}>Setara SMP / MTs</span>
                <p>Lanjutan setelah Paket A atau SD. Cocok untuk yang ingin memperoleh ijazah setara SMP.</p>
                <span className={styles.programCta}>Pelajari Selengkapnya &#8594;</span>
              </Link>

              <Link href="/program/kesetaraan#paket-c" className={styles.programCard}>
                <div className={styles.programIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/><line x1="12" y1="22" x2="12" y2="17.5"/></svg>
                </div>
                <h3>Paket C</h3>
                <span className={styles.programLevel}>Setara SMA / MA</span>
                <p>Program kesetaraan tertinggi. Ijazah dapat digunakan untuk kuliah atau melamar kerja.</p>
                <span className={styles.programCta}>Pelajari Selengkapnya &#8594;</span>
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ===== 5. TENTANG SINGKAT ===== */}
      <AnimatedSection>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.aboutSection}>
              <div className={styles.aboutContent}>
                <span className={styles.eyebrow}>Tentang PKBM RIDHO</span>
                <h2>Pendidikan Berkualitas untuk Semua Kalangan</h2>
                <p>
                  PKBM RIDHO hadir sebagai solusi pendidikan bagi masyarakat yang belum berkesempatan
                  menyelesaikan pendidikan formal. Kami percaya setiap orang berhak mendapat pendidikan
                  yang layak tanpa batasan usia, latar belakang, atau kondisi ekonomi.
                </p>
                <div className={styles.aboutFeatures}>
                  <div className={styles.aboutFeature}>
                    <span className={styles.featureCheck}>&#10003;</span>
                    <span>Tersedia jadwal Reguler (Kamis-Sabtu) & Karyawan (Sabtu-Minggu)</span>
                  </div>
                  <div className={styles.aboutFeature}>
                    <span className={styles.featureCheck}>&#10003;</span>
                    <span>Tenaga pendidik berpengalaman dan bersertifikat</span>
                  </div>
                  <div className={styles.aboutFeature}>
                    <span className={styles.featureCheck}>&#10003;</span>
                    <span>Biaya pendidikan sepenuhnya gratis</span>
                  </div>
                  <div className={styles.aboutFeature}>
                    <span className={styles.featureCheck}>&#10003;</span>
                    <span>Terbuka untuk semua usia dan kalangan</span>
                  </div>
                </div>
                <Link href="/profil" className="btn btn-primary">Selengkapnya Tentang Kami</Link>
              </div>
              <div className={styles.aboutVisual}>
                <Image src="/sempoa1.png" alt="Kegiatan PKBM RIDHO" width={320} height={320} className={styles.aboutImage} style={{ borderRadius: '16px', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ===== 6. PENGUMUMAN TERBARU ===== */}
      <AnimatedSection>
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Pengumuman</h2>
                <p className={styles.sectionSub}>Informasi penting yang perlu Anda ketahui.</p>
              </div>
              <Link href="/pengumuman" className="btn btn-secondary">Lihat Semua</Link>
            </div>

            {loading ? (
              <div className={styles.announcementList}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className={styles.skeletonRow} />
                ))}
              </div>
            ) : (
              <div className={styles.announcementList}>
                {pengumuman.map((item) => (
                  <Link key={item.id} href={`/pengumuman/${item.slug}`} className={styles.announcementCard}>
                    <div className={styles.annIcon}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    </div>
                    <div className={styles.annContent}>
                      <h3>{item.judul}</h3>
                      <p>{stripHtml(item.konten).slice(0, 150)}{stripHtml(item.konten).length > 150 ? '...' : ''}</p>
                    </div>
                    {item.prioritas === 'tinggi' || item.prioritas === 'penting' ? (
                      <span className={styles.annBadge}>Penting</span>
                    ) : null}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* ===== 7. BERITA & KEGIATAN ===== */}
      <AnimatedSection>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Berita & Kegiatan</h2>
                <p className={styles.sectionSub}>Kabar terkini seputar kegiatan dan capaian PKBM RIDHO.</p>
              </div>
              <Link href="/berita" className="btn btn-secondary">Lihat Semua</Link>
            </div>

            {loading ? (
              <div className={styles.cardGrid}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className={styles.skeletonCard}><div className={styles.skeletonImg} /><div className={styles.skeletonText} /><div className={styles.skeletonText} style={{ width: '60%' }} /></div>
                ))}
              </div>
            ) : (
              <div className={styles.cardGrid}>
                {berita.map((item) => (
                  <Link key={item.id} href={`/berita/${item.slug}`} className={styles.newsCard}>
                    <div className={styles.newsThumb}>
                      {item.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.thumbnail} alt={item.judul} />
                      ) : (
                        <div className={styles.thumbFallback}>
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></svg>
                        </div>
                      )}
                    </div>
                    <div className={styles.newsBody}>
                      <span className={styles.newsCat}>{item.kategori?.nama || 'Umum'}</span>
                      <h3>{item.judul}</h3>
                      <p>{stripHtml(item.ringkasan).slice(0, 120)}{stripHtml(item.ringkasan).length > 120 ? '...' : ''}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* ===== 8. FAQ ===== */}
      <AnimatedSection>
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={styles.sectionHeaderCenter}>
              <h2 className={styles.sectionTitle}>Pertanyaan yang Sering Diajukan</h2>
              <p className={styles.sectionSub}>Jawaban untuk keraguan yang paling umum tentang PKBM.</p>
            </div>
            <div className={styles.faqGrid}>
              <div className={styles.faqCard}>
                <h3>Apakah ijazahnya sah dan diakui?</h3>
                <p>Ya. Ijazah PKBM RIDHO <strong>setara dan sah secara hukum</strong>. Dapat digunakan untuk melanjutkan pendidikan ke SMP, SMA, atau perguruan tinggi, serta melamar pekerjaan.</p>
              </div>
              <div className={styles.faqCard}>
                <h3>Apakah benar-benar gratis?</h3>
                <p>Ya. <strong>Seluruh biaya pendidikan ditanggung</strong>. Peserta didik tidak dipungut biaya pendaftaran, SPP, maupun biaya ujian.</p>
              </div>
              <div className={styles.faqCard}>
                <h3>Siapa saja yang bisa mendaftar?</h3>
                <p>Semua warga negara Indonesia <strong>tanpa batasan usia</strong> pelajar, pekerja, ibu rumah tangga, maupun lansia yang ingin menyelesaikan pendidikan dasar dan menengah.</p>
              </div>
              <div className={styles.faqCard}>
                <h3>Bagaimana jadwal belajarnya?</h3>
                <p>Tersedia dua pilihan kelas: <strong>Reguler</strong> (Kamis - Sabtu) dan <strong>Karyawan</strong> (Sabtu - Minggu). Sangat cocok untuk menyesuaikan dengan jadwal pekerjaan Anda.</p>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ===== 9. CTA PENUTUP ===== */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>Siap Memulai Perjalanan Pendidikan Anda?</h2>
          <p>Bergabunglah dengan PKBM RIDHO pendidikan gratis, berkualitas, dan diakui resmi. Tidak ada kata terlambat untuk belajar.</p>
          <div className={styles.ctaActions}>
            <Link href="/pendaftaran" className="btn btn-primary btn-lg">Daftar Sekarang Gratis</Link>
            <Link href="/kontak" className="btn btn-secondary btn-lg">Hubungi Kami</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
