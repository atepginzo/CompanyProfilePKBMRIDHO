import Link from 'next/link';
import { SITE_CONTENT } from '@/data/content';
import styles from './page.module.css';

export const metadata = {
  title: 'Program Pendidikan - PKBM RIDHO',
  description: 'Program kesetaraan Paket A (setara SD), Paket B (setara SMP), dan Paket C (setara SMA) di PKBM RIDHO. Gratis, fleksibel, dan ijazah diakui resmi.',
};

const PROGRAMS = [
  {
    id: 'paket-a',
    nama: 'Paket A',
    setara: 'Setara SD / MI',
    deskripsi: 'Program pendidikan dasar bagi warga yang belum menyelesaikan atau tidak berkesempatan menempuh sekolah dasar.',
    untukSiapa: 'Anak usia sekolah yang putus sekolah, pekerja anak, atau siapa saja yang belum punya ijazah SD.',
    bisaApa: 'Setelah lulus, peserta didik mendapatkan ijazah setara SD yang sah dan dapat melanjutkan ke SMP atau Paket B.',
    jadwal: 'Tersedia kelas Reguler (Kamis-Sabtu) dan Karyawan (Sabtu-Minggu).',
    ikon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
    ),
  },
  {
    id: 'paket-b',
    nama: 'Paket B',
    setara: 'Setara SMP / MTs',
    deskripsi: 'Program pendidikan menengah pertama bagi lulusan SD atau Paket A yang ingin melanjutkan pendidikan.',
    untukSiapa: 'Lulusan SD/Paket A, remaja putus sekolah SMP, pekerja yang ingin punya ijazah SMP.',
    bisaApa: 'Ijazah Paket B setara SMP, dapat digunakan untuk masuk SMA, SMK, atau melanjutkan ke Paket C.',
    jadwal: 'Tersedia kelas Reguler (Kamis-Sabtu) dan Karyawan (Sabtu-Minggu).',
    ikon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
    ),
  },
  {
    id: 'paket-c',
    nama: 'Paket C',
    setara: 'Setara SMA / MA',
    deskripsi: 'Program pendidikan menengah atas bagi lulusan SMP atau Paket B yang ingin meraih ijazah setara SMA.',
    untukSiapa: 'Lulusan SMP/Paket B, pekerja, ibu rumah tangga, atau siapa saja yang ingin punya ijazah SMA.',
    bisaApa: 'Ijazah Paket C setara SMA sah untuk melamar kerja, mendaftar kuliah, atau mengikuti seleksi CPNS.',
    jadwal: 'Tersedia kelas Reguler (Kamis-Sabtu) dan Karyawan (Sabtu-Minggu).',
    ikon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/><line x1="12" y1="22" x2="12" y2="17.5"/></svg>
    ),
  },
];

export default function ProgramPage() {
  return (
    <div className={styles.page}>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Program Pendidikan</p>
        <h1>Program Kesetaraan PKBM RIDHO</h1>
        <p>Paket A, Paket B, dan Paket C sepenuhnya gratis, pilihan kelas Reguler/Karyawan, dan ijazah diakui resmi pemerintah.</p>
      </section>

      {/* Ringkasan */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.introBox}>
            <h2>Semua Program Pendidikan di PKBM RIDHO Gratis</h2>
            <p>
              PKBM RIDHO menyediakan tiga program pendidikan kesetaraan yang dibiayai sepenuhnya. 
              peserta didik <strong>tidak dipungut biaya pendaftaran, SPP, maupun biaya ujian</strong>. 
              Program terbuka untuk semua usia dan kalangan tanpa batasan.
            </p>
          </div>
          
          <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,.04)' }}>
              <div style={{ padding: '20px', background: 'linear-gradient(135deg, #0C4A6E, #0369A1)', color: '#fff' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Kelas Reguler</h3>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Paket B & C</span>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>Hari</span>
                  <strong style={{ color: '#0f172a' }}>Kamis - Sabtu</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>Jam</span>
                  <strong style={{ color: '#0f172a' }}>07.30 - 15.00 WIB</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>Jenis</span>
                  <strong style={{ color: '#0f172a' }}>Tatap Muka (Luring)</strong>
                </div>
              </div>
            </div>
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,.04)' }}>
              <div style={{ padding: '20px', background: 'linear-gradient(135deg, #0F766E, #115E59)', color: '#fff' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Kelas Non-Reguler</h3>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Paket B & C (Karyawan)</span>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>Hari</span>
                  <strong style={{ color: '#0f172a' }}>Sabtu - Minggu</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>Jam</span>
                  <strong style={{ color: '#0f172a' }}>09.00 - 12.30 WIB</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>Jenis</span>
                  <strong style={{ color: '#0f172a' }}>Tatap Muka (Luring)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Per Program */}
      {PROGRAMS.map((program, index) => (
        <section
          key={program.id}
          id={program.id}
          className={`${styles.section} ${index % 2 !== 0 ? styles.sectionAlt : ''}`}
        >
          <div className={styles.container}>
            <div className={styles.programDetail}>
              <div className={styles.programHeader}>
                <div className={styles.programIcon}>{program.ikon}</div>
                <div>
                  <h2>{program.nama}</h2>
                  <span className={styles.programBadge}>{program.setara}</span>
                </div>
              </div>
              <p className={styles.programDesc}>{program.deskripsi}</p>

              <div className={styles.programQA}>
                <div className={styles.qaItem}>
                  <h3>Untuk siapa program ini?</h3>
                  <p>{program.untukSiapa}</p>
                </div>
                <div className={styles.qaItem}>
                  <h3>Setelah lulus bisa apa?</h3>
                  <p>{program.bisaApa}</p>
                </div>
                <div className={styles.qaItem}>
                  <h3>Bagaimana jadwal belajarnya?</h3>
                  <p>{program.jadwal}</p>
                </div>
                <div className={styles.qaItem}>
                  <h3>Berapa biayanya?</h3>
                  <p><strong>Gratis sepenuhnya.</strong> Tidak ada biaya pendaftaran, SPP, maupun biaya ujian.</p>
                </div>
              </div>

              <Link href="/pendaftaran" className="btn btn-primary">Daftar Program {program.nama} Gratis</Link>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>Belum Yakin Program Mana yang Tepat?</h2>
          <p>Hubungi kami langsung, kami siap membantu Anda memilih program yang paling sesuai dengan kebutuhan Anda.</p>
          <div className={styles.ctaActions}>
            <Link href="/kontak" className="btn btn-primary btn-lg">Hubungi Kami</Link>
            <Link href="/pendaftaran" className="btn btn-secondary btn-lg">Lihat Info Pendaftaran</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
