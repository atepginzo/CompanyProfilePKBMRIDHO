import Link from 'next/link';
import styles from './not-found.module.css';

export const metadata = {
  title: '404 - Halaman Tidak Ditemukan | PKBM RIDHO',
};

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Halaman Tidak Ditemukan</h1>
        <p className={styles.desc}>
          Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
        </p>
        <div className={styles.actions}>
          <Link href="/" className="btn btn-primary btn-lg">
            Kembali ke Beranda
          </Link>
          <Link href="/kontak" className="btn btn-secondary btn-lg">
            Hubungi Kami
          </Link>
        </div>
        <div className={styles.links}>
          <p>Mungkin Anda mencari:</p>
          <ul>
            <li><Link href="/layanan">Program Pendidikan</Link></li>
            <li><Link href="/pendaftaran">Pendaftaran</Link></li>
            <li><Link href="/profil">Profil PKBM RIDHO</Link></li>
            <li><Link href="/berita">Berita & Kegiatan</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

