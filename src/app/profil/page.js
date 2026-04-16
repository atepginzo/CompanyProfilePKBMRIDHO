import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Profil - PKBM RIDHO',
  description: 'Mengenal lebih dekat PKBM RIDHO: visi, misi, sejarah, nilai-nilai, dan legalitas lembaga pendidikan nonformal di Kecamatan Paseh, Kabupaten Bandung.',
};

export default function ProfilPage() {
  return (
    <div className={styles.page}>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Tentang Kami</p>
        <h1>Profil PKBM RIDHO</h1>
        <p>Pusat Kegiatan Belajar Masyarakat yang berkomitmen mewujudkan pendidikan kesetaraan gratis dan berkualitas.</p>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.twoCol}>
            <div className={styles.contentBlock}>
              <h2>Tentang PKBM RIDHO</h2>
              <p>
                PKBM RIDHO adalah lembaga pendidikan nonformal yang berlokasi di Kecamatan Paseh, 
                Kabupaten Bandung. Kami menyelenggarakan program pendidikan kesetaraan Paket A (setara SD), 
                Paket B (setara SMP), dan Paket C (setara SMA) yang sepenuhnya gratis dan terbuka 
                untuk seluruh lapisan masyarakat.
              </p>
              <p>
                Kami percaya bahwa pendidikan adalah hak setiap warga negara tanpa memandang usia, 
                latar belakang, atau kondisi ekonomi. PKBM RIDHO hadir sebagai jembatan bagi mereka 
                yang belum berkesempatan menyelesaikan pendidikan formal agar bisa memperoleh ijazah 
                yang sah dan diakui oleh pemerintah.
              </p>
            </div>
            <div className={styles.highlightCard}>
              <div className={styles.highlightItem}>
                <strong>Resmi</strong>
                <span>Izin Operasional</span>
              </div>
              <div className={styles.highlightItem}>
                <strong>Gratis</strong>
                <span>Biaya Pendidikan</span>
              </div>
              <div className={styles.highlightItem}>
                <strong>3 Program</strong>
                <span>Paket A, B, C</span>
              </div>
              <div className={styles.highlightItem}>
                <strong>Fleksibel</strong>
                <span>Jadwal Belajar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.visiMisi}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Visi & Misi</h2>

          <div className={styles.vmGrid}>
            <div className={styles.vmCard}>
              <div className={styles.vmIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              </div>
              <h3>Visi</h3>
              <p>
                Pendidikan Non Formal yang Unggul dalam Prestasi Berwawasan Teknologi, Lingkungan, dan Budaya.
              </p>
            </div>

            <div className={styles.vmCard}>
              <div className={styles.vmIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h3>Misi</h3>
              <ol>
                <li>Meningkatkan Kinerja Pendidikan Non Formal melalui inovasi dalam input dan proses pembelajaran.</li>
                <li>Menciptakan Lingkungan Pendidikan Non Formal yang kondusif untuk pelaksanaan kegiatan belajar mengajar.</li>
                <li>Meningkatkan profesionalisme tutor dan penyelenggara.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Legalitas */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Legalitas & Pengakuan</h2>
          <p style={{ textAlign: 'center', color: '#64748B', maxWidth: '600px', margin: '-24px auto 32px', fontSize: '15px', lineHeight: '1.7' }}>
            PKBM RIDHO terdaftar secara resmi dan diakui oleh pemerintah. Klik pada kartu di bawah untuk melihat bukti legalitas.
          </p>
          <div className={styles.legalGrid}>
            <a href="https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/P2960528" target="_blank" rel="noopener noreferrer" className={styles.legalCard} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
              <div className={styles.legalIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
              </div>
              <h3>Izin Operasional Resmi</h3>
              <p>PKBM RIDHO memiliki izin operasional yang diterbitkan oleh Dinas Pendidikan setempat dan terdaftar secara resmi.</p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '13px', fontWeight: '600', color: '#0369A1' }}>
                Lihat di Kemendikdasmen
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </span>
            </a>
            <div className={styles.legalCard}>
              <div className={styles.legalIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <h3>Ijazah Sah & Setara</h3>
              <p>Ijazah yang diterbitkan PKBM RIDHO diakui setara dengan ijazah pendidikan formal dan dapat digunakan untuk melanjutkan pendidikan atau melamar pekerjaan.</p>
            </div>
            <a href="https://referensi.data.kemendikdasmen.go.id/pendidikan/npsn/P2960528" target="_blank" rel="noopener noreferrer" className={styles.legalCard} style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
              <div className={styles.legalIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
              </div>
              <h3>Terdaftar di Kemendikdasmen</h3>
              <p>PKBM RIDHO terdaftar resmi di sistem Kementerian Pendidikan Dasar dan Menengah Republik Indonesia dengan NPSN: P2960528.</p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '13px', fontWeight: '600', color: '#0369A1' }}>
                Verifikasi di Kemendikdasmen
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>Tertarik Mengenal Lebih Dekat?</h2>
          <p>Kunjungi kami atau hubungi langsung untuk informasi lebih lanjut tentang program pendidikan di PKBM RIDHO.</p>
          <div className={styles.ctaActions}>
            <Link href="/pendaftaran" className="btn btn-primary btn-lg">Daftar Sekarang Gratis</Link>
            <Link href="/kontak" className="btn btn-secondary btn-lg">Hubungi Kami</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
