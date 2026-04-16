'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import FormInput from '@/components/admin/FormInput';
import FormTextarea from '@/components/admin/FormTextarea';
import FormSelect from '@/components/admin/FormSelect';
import { useToast } from '@/context/ToastContext';

export default function TambahFasilitasPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [namaFasilitas, setNamaFasilitas] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [urutan, setUrutan] = useState('0');
  const [status, setStatus] = useState('aktif');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (namaFasilitas.trim().length < 3) {
      toast.error('Nama fasilitas minimal 3 karakter');
      return;
    }

    setLoading(true);
    try {
      await adminAPI.create('fasilitas', {
        nama_fasilitas: namaFasilitas,
        deskripsi,
        kategori,
        lokasi,
        urutan: parseInt(urutan || '0', 10) || 0,
        status,
      });

      toast.success('Fasilitas berhasil ditambahkan');
      router.push('/admin/fasilitas');
    } catch (error) {
      toast.error(error.message || 'Gagal menambahkan fasilitas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: 'var(--space-6)' }}>
      <form onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: 'var(--space-5)' }}>Tambah Fasilitas</h2>

        <FormInput
          id="nama_fasilitas"
          label="Nama Fasilitas"
          required
          value={namaFasilitas}
          onChange={(event) => setNamaFasilitas(event.target.value)}
          placeholder="Contoh: Laboratorium Komputer"
        />

        <FormTextarea
          id="deskripsi"
          label="Deskripsi"
          value={deskripsi}
          onChange={(event) => setDeskripsi(event.target.value)}
          rows={6}
          placeholder="Jelaskan fasilitas secara ringkas"
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <FormInput
            id="kategori"
            label="Kategori"
            value={kategori}
            onChange={(event) => setKategori(event.target.value)}
            placeholder="Contoh: Laboratorium"
          />

          <FormInput
            id="lokasi"
            label="Lokasi"
            value={lokasi}
            onChange={(event) => setLokasi(event.target.value)}
            placeholder="Contoh: Gedung A Lt.2"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <FormInput
            id="urutan"
            type="number"
            label="Urutan"
            value={urutan}
            onChange={(event) => setUrutan(event.target.value)}
          />

          <FormSelect
            id="status"
            label="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={[
              { value: 'aktif', label: 'Aktif' },
              { value: 'nonaktif', label: 'Nonaktif' },
            ]}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          <Link href="/admin/fasilitas" className="btn btn-secondary">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
