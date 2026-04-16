import Link from 'next/link';
import { SITE_CONTENT } from '@/data/content';
import styles from './page.module.css';

export const metadata = {
  title: 'Pendaftaran Peserta Didik Baru - PKBM RIDHO',
  description: 'Informasi lengkap penerimaan peserta didik baru (PPDB) PKBM RIDHO. Program Paket A, B, dan C gratis. Alur pendaftaran, persyaratan, jadwal, dan tata cara.',
};

const ALUR_PENDAFTARAN = [
  {
    step: '01',
    judul: 'Hubungi & Konsultasi',
    desc: 'Hubungi kami via WhatsApp atau datang langsung ke PKBM RIDHO. Tim kami akan membantu konsultasi program yang sesuai untuk Anda.',
    detail: 'WhatsApp: 0813-9422-3675',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 5.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
    ),
  },
  {
    step: '02',
    judul: 'Siapkan Dokumen',
    desc: 'Siapkan semua berkas persyaratan yang diperlukan. Pastikan lengkap agar proses pendaftaran berjalan lancar.',
    detail: 'Lihat daftar persyaratan di bawah',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    ),
  },
  {
    step: '03',
    judul: 'Datang & Isi Formulir',
    desc: 'Datang ke PKBM RIDHO pada jam kerja. Isi formulir pendaftaran dan serahkan berkas ke dalam stop map sesuai jenjang program.',
    detail: 'Jam kerja: 09.00 - 15.00 WIB',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
    ),
  },
  {
    step: '04',
    judul: 'Verifikasi Berkas',
    desc: 'Petugas kami akan memverifikasi kelengkapan berkas Anda. Jika ada kekurangan, kami akan memberitahu dan membantu.',
    detail: 'Proses verifikasi 1-2 hari kerja',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    ),
  },
  {
    step: '05',
    judul: 'Penempatan Kelas',
    desc: 'Setelah berkas lolos verifikasi, Anda akan ditempatkan di kelas sesuai jenjang dan jadwal pilihan (Reguler atau Karyawan).',
    detail: 'Pilih jadwal yang sesuai',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
    ),
  },
  {
    step: '06',
    judul: 'Mulai Belajar!',
    desc: 'Selamat! Anda resmi menjadi peserta didik PKBM RIDHO. Mulai proses belajar sesuai jadwal yang telah ditentukan.',
    detail: 'Tidak dipungut biaya apapun',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>
    ),
  },
];

const PROGRAM_OPTIONS = [
  {
    nama: 'Paket A',
    setara: 'Setara SD / MI',
    mapColor: 'Merah',
    syarat: 'Belum memiliki ijazah SD',
    jadwal: 'Reguler & Karyawan',
    color: '#EF4444',
    bg: '#FEF2F2',
  },
  {
    nama: 'Paket B',
    setara: 'Setara SMP / MTs',
    mapColor: 'Kuning',
    syarat: 'Memiliki ijazah SD atau Paket A',
    jadwal: 'Reguler & Karyawan',
    color: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    nama: 'Paket C',
    setara: 'Setara SMA / MA',
    mapColor: 'Biru',
    syarat: 'Memiliki ijazah SMP atau Paket B',
    jadwal: 'Reguler & Karyawan',
    color: '#3B82F6',
    bg: '#EFF6FF',
  },
];

export default function PendaftaranPage() {
  const { pendaftaran } = SITE_CONTENT;

  return (
    <div className={styles.page}>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>Penerimaan Peserta Didik Baru (PPDB)</span>
          <h1>Daftar di PKBM RIDHO, Gratis!</h1>
          <p>Pendidikan kesetaraan Paket A, B, dan C tanpa dipungut biaya apa pun. Terbuka untuk semua usia tanpa batasan.</p>
          <div className={styles.heroCta}>
            <a href="https://wa.me/6281394223675?text=Halo%20PKBM%20RIDHO%2C%20saya%20ingin%20mendaftar%20sebagai%20peserta%20didik%20baru." target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
              Daftar via WhatsApp
            </a>
            <a href="#alur-pendaftaran" className="btn btn-secondary btn-lg">
              Lihat Alur Pendaftaran
            </a>
          </div>
        </div>
      </section>

      {/* STATUS PPDB */}
      <section className={styles.statusSection}>
        <div className={styles.container}>
          <div className={styles.statusCard}>
            <div className={styles.statusIndicator}>
              <span className={styles.statusDot} />
              <span className={styles.statusText}>PENDAFTARAN DIBUKA</span>
            </div>
            <div className={styles.statusInfo}>
              <div className={styles.statusItem}>
                <strong>Tahun Ajaran</strong>
                <span>2025/2026</span>
              </div>
              <div className={styles.statusItem}>
                <strong>Gelombang</strong>
                <span>Sepanjang Tahun</span>
              </div>
              <div className={styles.statusItem}>
                <strong>Biaya</strong>
                <span className={styles.freeTag}>GRATIS</span>
              </div>
              <div className={styles.statusItem}>
                <strong>Waktu Daftar</strong>
                <span>Senin - Sabtu, 09.00 - 15.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PILIHAN PROGRAM */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Pilihan Program Pendidikan</h2>
          <p className={styles.sectionSub}>Pilih program sesuai jenjang pendidikan terakhir Anda. Semua program sepenuhnya GRATIS.</p>
          <div className={styles.programGrid}>
            {PROGRAM_OPTIONS.map((program) => (
              <div key={program.nama} className={styles.programOption} style={{ borderTopColor: program.color }}>
                <div className={styles.programHeader}>
                  <h3>{program.nama}</h3>
                  <span className={styles.programBadge} style={{ background: program.bg, color: program.color }}>
                    {program.setara}
                  </span>
                </div>
                <ul className={styles.programDetails}>
                  <li>
                    <span className={styles.detailLabel}>Syarat Masuk</span>
                    <span>{program.syarat}</span>
                  </li>
                  <li>
                    <span className={styles.detailLabel}>Jadwal Kelas</span>
                    <span>{program.jadwal}</span>
                  </li>
                  <li>
                    <span className={styles.detailLabel}>Warna Stop Map</span>
                    <span style={{ fontWeight: 700, color: program.color }}>{program.mapColor}</span>
                  </li>
                  <li>
                    <span className={styles.detailLabel}>Biaya</span>
                    <span style={{ fontWeight: 700, color: '#059669' }}>Gratis Sepenuhnya</span>
                  </li>
                </ul>
                <a
                  href={`https://wa.me/6281394223675?text=Halo%20PKBM%20RIDHO%2C%20saya%20ingin%20mendaftar%20program%20${encodeURIComponent(program.nama)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', textAlign: 'center' }}
                >
                  Daftar {program.nama}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERSYARATAN DOKUMEN */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Persyaratan Dokumen</h2>
          <p className={styles.sectionSub}>Siapkan dokumen berikut sebelum mendaftar. Jika ada yang belum dimiliki, tetap bisa dikonsultasikan.</p>
          <div className={styles.reqGrid}>
            <div className={styles.reqCardNew}>
              <div className={styles.reqHeader}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <h3>Dokumen Wajib</h3>
              </div>
              <ol className={styles.reqList}>
                {pendaftaran.syarat.map((item, idx) => (
                  <li key={idx} dangerouslySetInnerHTML={{ __html: item.replace('Warna Merah', '<strong style="color:#EF4444">Warna Merah</strong>').replace('Warna Kuning', '<strong style="color:#F59E0B">Warna Kuning</strong>').replace('Warna Biru', '<strong style="color:#3B82F6">Warna Biru</strong>') }}></li>
                ))}
              </ol>
            </div>
            <div className={styles.reqCardNew}>
              <div className={styles.reqHeader}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                <h3>Informasi Penting</h3>
              </div>
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span className={styles.infoCheck}>&#10003;</span>
                  <span>Formulir pendaftaran tersedia gratis di lokasi</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoCheck}>&#10003;</span>
                  <span>Jika tidak memiliki ijazah sebelumnya, tetap bisa mendaftar</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoCheck}>&#10003;</span>
                  <span>Kami membantu penempatan program yang sesuai</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoCheck}>&#10003;</span>
                  <span>Pendaftaran berlaku sepanjang tahun</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoCheck}>&#10003;</span>
                  <span>Tidak ada biaya pendaftaran, SPP, maupun ujian</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALUR PENDAFTARAN */}
      <section className={styles.section} id="alur-pendaftaran">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Alur Penerimaan Peserta Didik Baru</h2>
          <p className={styles.sectionSub}>6 langkah mudah untuk menjadi peserta didik PKBM RIDHO.</p>
          <div className={styles.stepsGrid}>
            {ALUR_PENDAFTARAN.map((item, idx) => (
              <div key={item.step} className={styles.stepCard}>
                <div className={styles.stepTop}>
                  <div className={styles.stepIcon}>{item.icon}</div>
                  <div className={styles.stepNumber}>{item.step}</div>
                </div>
                <h3>{item.judul}</h3>
                <p>{item.desc}</p>
                <span className={styles.stepDetail}>{item.detail}</span>
                {idx < ALUR_PENDAFTARAN.length - 1 && <div className={styles.stepConnector} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JADWAL BELAJAR */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Jadwal Pembelajaran</h2>
          <p className={styles.sectionSub}>Kegiatan belajar tatap muka (luring) dengan jadwal fleksibel.</p>
          <div className={styles.scheduleGrid}>
            <div className={styles.scheduleCard}>
              <div className={styles.scheduleHeader} style={{ background: 'linear-gradient(135deg, #0C4A6E, #0369A1)' }}>
                <h3>Kelas Reguler</h3>
                <span>Paket B & C</span>
              </div>
              <div className={styles.scheduleBody}>
                <div className={styles.scheduleRow}><span>Hari</span><strong>Kamis - Sabtu</strong></div>
                <div className={styles.scheduleRow}><span>Jam</span><strong>07.30 - 15.00 WIB</strong></div>
                <div className={styles.scheduleRow}><span>Lokasi</span><strong>Bumi Ridho</strong></div>
              </div>
            </div>
            <div className={styles.scheduleCard}>
              <div className={styles.scheduleHeader} style={{ background: 'linear-gradient(135deg, #0F766E, #115E59)' }}>
                <h3>Kelas Non-Reguler</h3>
                <span>Paket B & C (Karyawan)</span>
              </div>
              <div className={styles.scheduleBody}>
                <div className={styles.scheduleRow}><span>Hari</span><strong>Sabtu - Minggu</strong></div>
                <div className={styles.scheduleRow}><span>Jam</span><strong>09.00 - 12.30 WIB</strong></div>
                <div className={styles.scheduleRow}><span>Lokasi</span><strong>Bumi Ridho</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOKASI */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Lokasi Pendaftaran</h2>
          <div className={styles.locationCard}>
            <div className={styles.locationInfo}>
              <div className={styles.locationRow}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <div>
                  <strong>Bumi Ridho</strong>
                  <span>{pendaftaran.alamat}</span>
                </div>
              </div>
              <div className={styles.locationRow}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <div>
                  <strong>Jam Pelayanan</strong>
                  <span>Senin - Sabtu, 09.00 - 15.00 WIB</span>
                </div>
              </div>
              <div className={styles.locationRow}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 5.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                <div>
                  <strong>WhatsApp</strong>
                  <span>0813-9422-3675</span>
                </div>
              </div>
              <div className={styles.locationRow}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <div>
                  <strong>Email</strong>
                  <span>pkbmridho2000@gmail.com</span>
                </div>
              </div>
            </div>
            <div className={styles.locationMap}>
              <iframe
                src="https://maps.google.com/maps?q=WQJG%2BHGR,%20Jln.%20Kelepu%20Sanding%20Kp.%20Singalombang,%20RT.01/RW.04,%20Sindangsari,%20Kec.%20Paseh,%20Kabupaten%20Bandung,%20Jawa%20Barat%2040383&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '16px', minHeight: '300px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi PKBM RIDHO"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ PENDAFTARAN */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Pertanyaan Seputar Pendaftaran</h2>
          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <h3>Apakah ada batasan usia untuk mendaftar?</h3>
              <p>Tidak ada. PKBM RIDHO terbuka untuk semua usia mulai dari remaja hingga lansia. Tidak ada batasan usia maksimal.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Kapan saya bisa mulai belajar?</h3>
              <p>Pendaftaran dibuka sepanjang tahun. Anda bisa langsung mulai belajar setelah terdaftar dan ditempatkan di rombel (rombongan belajar) berikutnya.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Apakah bisa sambil bekerja?</h3>
              <p>Bisa. Terdapat pilihan Kelas Karyawan (Sabtu - Minggu) khusus untuk peserta didik yang bekerja di hari biasa.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Ijazahnya diakui untuk melamar kerja?</h3>
              <p>Ya. Ijazah yang diterbitkan sah secara hukum dan setara dengan ijazah pendidikan formal. Bisa digunakan untuk melamar kerja, daftar kuliah, atau seleksi CPNS.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Bagaimana jika saya tidak punya ijazah sebelumnya?</h3>
              <p>Tetap bisa mendaftar. Tim kami akan membantu menentukan program yang sesuai berdasarkan wawancara dan asesmen singkat.</p>
            </div>
            <div className={styles.faqItem}>
              <h3>Apakah ada ujian masuk?</h3>
              <p>Tidak ada ujian masuk. Proses pendaftaran hanya memerlukan kelengkapan berkas dan verifikasi dokumen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2>Siap Mendaftar?</h2>
          <p>Jangan ragu, pendidikan ini gratis, dan tidak ada kata terlambat untuk belajar. Hubungi kami sekarang!</p>
          <div className={styles.ctaActions}>
            <a href="https://wa.me/6281394223675?text=Halo%20PKBM%20RIDHO%2C%20saya%20ingin%20mendaftar%20sebagai%20peserta%20didik%20baru." target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
              Daftar via WhatsApp
            </a>
            <Link href="/program/kesetaraan" className="btn btn-secondary btn-lg">Lihat Program Pendidikan</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
