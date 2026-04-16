'use client';

import { useState } from 'react';
import Link from 'next/link';
import { publicAPI } from '@/lib/api';
import styles from './page.module.css';

export default function KontakPage() {
  const [form, setForm] = useState({
    nama: '',
    email: '',
    subjek: '',
    pesan: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const response = await publicAPI.kirimPesan(form);
      setFeedback({ type: 'success', message: response.message || 'Pesan berhasil dikirim. Terima kasih!' });
      setForm({ nama: '', email: '', subjek: '', pesan: '' });
    } catch (error) {
      setFeedback({ type: 'error', message: error.message || 'Gagal mengirim pesan. Silakan coba lagi.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Kontak</p>
        <h1>Hubungi PKBM RIDHO</h1>
        <p>Ada pertanyaan tentang program pendidikan atau pendaftaran? Hubungi kami langsung.</p>
      </section>

      {/* WhatsApp Prominent */}
      <section className={styles.waSection}>
        <div className={styles.waCard}>
          <div className={styles.waIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div className={styles.waContent}>
            <h2>Hubungi via WhatsApp</h2>
            <p>Cara tercepat untuk bertanya tentang program, pendaftaran, atau informasi lainnya.</p>
          </div>
          <a
            href="https://wa.me/6281394223675"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.waBtn}
          >
            Chat WhatsApp
          </a>
        </div>
      </section>

      <section className={styles.grid}>
        <article className={styles.infoCard}>
          <h2>Informasi Kontak</h2>
          <ul>
            <li>
              <div className={styles.contactIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <strong>Alamat</strong>
                <span>Kecamatan Paseh, Kabupaten Bandung, Jawa Barat</span>
              </div>
            </li>
            <li>
              <div className={styles.contactIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
              </div>
              <div>
                <strong>Telepon / WhatsApp</strong>
                <span>0813-9422-3675</span>
              </div>
            </li>
            <li>
              <div className={styles.contactIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <strong>Email</strong>
                <span>pkbmridho2000@gmail.com</span>
              </div>
            </li>
            <li>
              <div className={styles.contactIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <strong>Jam Layanan</strong>
                <span>Senin - Sabtu, 08.00 - 16.00 WIB</span>
              </div>
            </li>
            <li>
              <div className={styles.contactIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37a4 4 0 11-7.73 1.26 4 4 0 017.73-1.26z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </div>
              <div>
                <strong>Instagram</strong>
                <span>
                  <a href="https://instagram.com/pkbmridho" target="_blank" rel="noopener noreferrer">@pkbmridho</a>
                  {' '}dan{' '}
                  <a href="https://instagram.com/pkbm_ridho" target="_blank" rel="noopener noreferrer">@pkbm_ridho</a>
                </span>
              </div>
            </li>
          </ul>
        </article>

        <form className={styles.formCard} onSubmit={handleSubmit}>
          <h2>Kirim Pesan</h2>

          <label>
            Nama
            <input
              required
              value={form.nama}
              onChange={(event) => setField('nama', event.target.value)}
              placeholder="Nama lengkap"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setField('email', event.target.value)}
              placeholder="email@contoh.com"
            />
          </label>

          <label>
            Subjek
            <input
              required
              value={form.subjek}
              onChange={(event) => setField('subjek', event.target.value)}
              placeholder="Topik pesan"
            />
          </label>

          <label>
            Pesan
            <textarea
              required
              rows={5}
              value={form.pesan}
              onChange={(event) => setField('pesan', event.target.value)}
              placeholder="Tulis pesan Anda"
            />
          </label>

          {feedback.message ? (
            <p className={`${styles.feedback} ${feedback.type === 'success' ? styles.success : styles.error}`}>
              {feedback.message}
            </p>
          ) : null}

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Mengirim...' : 'Kirim Pesan'}
          </button>
        </form>
      </section>
    </div>
  );
}
