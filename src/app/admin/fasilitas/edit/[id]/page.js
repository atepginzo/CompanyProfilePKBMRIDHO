'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import FormInput from '@/components/admin/FormInput';
import FormTextarea from '@/components/admin/FormTextarea';
import FormSelect from '@/components/admin/FormSelect';
import { useToast } from '@/context/ToastContext';

export default function EditFasilitasPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [namaFasilitas, setNamaFasilitas] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [urutan, setUrutan] = useState('0');
  const [status, setStatus] = useState('aktif');

  useEffect(() => {
    adminAPI
      .getOne('fasilitas', params.id)
      .then((res) => {
        const data = res.data;
        setNamaFasilitas(data.namaFasilitas || '');
        setDeskripsi(data.deskripsi || '');
        setKategori(data.kategori || '');
        setLokasi(data.lokasi || '');
        setUrutan(String(data.urutan ?? 0));
        setStatus(data.status || 'aktif');
      })
      .catch(() => {
        toast.error('Gagal memuat data fasilitas');
        router.push('/admin/fasilitas');
      })
      .finally(() => setInitialLoading(false));
  }, [params.id, router, toast]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (namaFasilitas.trim().length < 3) {
      toast.error('Nama fasilitas minimal 3 karakter');
      return;
    }

    setLoading(true);
    try {
      await adminAPI.update('fasilitas', params.id, {
        nama_fasilitas: namaFasilitas,
        deskripsi,
        kategori,
        lokasi,
        urutan: parseInt(urutan || '0', 10) || 0,
        status,
      });

      toast.success('Fasilitas berhasil diperbarui');
      router.push('/admin/fasilitas');
    } catch (error) {
      toast.error(error.message || 'Gagal memperbarui fasilitas');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="card" style={{ padding: 'var(--space-6)' }}>Memuat data...</div>;
  }

  return (
    <div className="card" style={{ padding: 'var(--space-6)' }}>
      <form onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: 'var(--space-5)' }}>Edit Fasilitas</h2>

        <FormInput
          id="nama_fasilitas"
          label="Nama Fasilitas"
          required
          value={namaFasilitas}
          onChange={(event) => setNamaFasilitas(event.target.value)}
        />

        <FormTextarea
          id="deskripsi"
          label="Deskripsi"
          value={deskripsi}
          onChange={(event) => setDeskripsi(event.target.value)}
          rows={6}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <FormInput
            id="kategori"
            label="Kategori"
            value={kategori}
            onChange={(event) => setKategori(event.target.value)}
          />

          <FormInput
            id="lokasi"
            label="Lokasi"
            value={lokasi}
            onChange={(event) => setLokasi(event.target.value)}
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
            {loading ? 'Menyimpan...' : 'Update'}
          </button>
          <Link href="/admin/fasilitas" className="btn btn-secondary">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
