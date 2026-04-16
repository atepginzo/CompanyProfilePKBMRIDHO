'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminAPI } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import styles from './page.module.css';

const GRUP_LABELS = {
  umum: { label: 'Umum', desc: 'Nama institusi, tagline, dan informasi dasar.' },
  beranda: { label: 'Beranda', desc: 'Konten hero section dan tampilan halaman utama.' },
  kontak: { label: 'Kontak', desc: 'Alamat, telepon, email, dan embed peta.' },
  sosial_media: { label: 'Sosial Media', desc: 'URL profil sosial media institusi.' },
  statistik: { label: 'Statistik', desc: 'Angka-angka yang ditampilkan di beranda publik.' },
};

const FIELD_LABELS = {
  nama_institusi: 'Nama Institusi',
  tagline: 'Tagline',
  logo: 'Logo URL',
  video_profil_url: 'Video Profil URL',
  hero_headline: 'Hero Headline',
  hero_sub_headline: 'Hero Sub-headline',
  hero_background: 'Hero Background Image',
  alamat: 'Alamat',
  telepon: 'Telepon',
  email_institusi: 'Email Institusi',
  google_maps_embed: 'Google Maps Embed URL',
  instagram: 'Instagram',
  youtube: 'YouTube',
  facebook: 'Facebook',
  jumlah_mahasiswa: 'Jumlah Mahasiswa',
  total_alumni: 'Total Alumni',
  akreditasi: 'Akreditasi',
  mitra_industri: 'Mitra Industri',
};

export default function PengaturanPage() {
  const toast = useToast();
  const [grouped, setGrouped] = useState({});
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true);
    adminAPI
      .getList('pengaturan')
      .then((res) => {
        setGrouped(res.grouped || {});
        const vals = {};
        for (const item of res.data || []) {
          vals[item.kunci] = item.nilai || '';
        }
        setValues(vals);
      })
      .catch(() => toast.error('Gagal memuat pengaturan'))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (kunci, nilai) => {
    setValues((prev) => ({ ...prev, [kunci]: nilai }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const settings = Object.entries(values).map(([kunci, nilai]) => ({ kunci, nilai }));
      await fetch('/api/admin/pengaturan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      }).then((r) => r.json());
      toast.success('Pengaturan berhasil disimpan');
    } catch {
      toast.error('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className="spinner" />
        <p>Memuat pengaturan...</p>
      </div>
    );
  }

  const grupKeys = Object.keys(GRUP_LABELS);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>Pengaturan Situs</h2>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan Semua'}
        </button>
      </div>

      {grupKeys.map((g) => {
        const items = grouped[g];
        if (!items || items.length === 0) return null;
        const info = GRUP_LABELS[g] || { label: g, desc: '' };

        return (
          <section key={g} className={styles.section}>
            <div className={styles.sectionHead}>
              <h3>{info.label}</h3>
              <p>{info.desc}</p>
            </div>
            <div className={styles.fieldGrid}>
              {items.map((item) => (
                <div key={item.kunci} className={styles.fieldGroup}>
                  <label className="form-label" htmlFor={`setting-${item.kunci}`}>
                    {FIELD_LABELS[item.kunci] || item.kunci}
                  </label>
                  {item.tipe === 'image' || item.kunci.includes('embed') || item.kunci.includes('url') ? (
                    <input
                      id={`setting-${item.kunci}`}
                      className="form-input"
                      value={values[item.kunci] || ''}
                      onChange={(e) => handleChange(item.kunci, e.target.value)}
                      placeholder={`Masukkan ${FIELD_LABELS[item.kunci] || item.kunci}`}
                    />
                  ) : item.tipe === 'number' ? (
                    <input
                      id={`setting-${item.kunci}`}
                      type="number"
                      className="form-input"
                      value={values[item.kunci] || ''}
                      onChange={(e) => handleChange(item.kunci, e.target.value)}
                    />
                  ) : (
                    <input
                      id={`setting-${item.kunci}`}
                      className="form-input"
                      value={values[item.kunci] || ''}
                      onChange={(e) => handleChange(item.kunci, e.target.value)}
                      placeholder={`Masukkan ${FIELD_LABELS[item.kunci] || item.kunci}`}
                    />
                  )}
                  <span className="form-hint">{item.kunci}</span>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <div className={styles.bottomSave}>
        <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
        </button>
      </div>
    </div>
  );
}
