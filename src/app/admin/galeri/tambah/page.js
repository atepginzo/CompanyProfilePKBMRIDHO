'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import FormInput from '@/components/admin/FormInput';
import FormTextarea from '@/components/admin/FormTextarea';
import FormSelect from '@/components/admin/FormSelect';
import FormFileUpload from '@/components/admin/FormFileUpload';
import { useToast } from '@/context/ToastContext';

export default function TambahGaleriPage() {
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [kategori, setKategori] = useState([]);

  const [judulFoto, setJudulFoto] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [kategoriId, setKategoriId] = useState('');
  const [linkGdrive, setLinkGdrive] = useState('');
  const [tanggalKegiatan, setTanggalKegiatan] = useState('');
  const [status, setStatus] = useState('draft');
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    adminAPI
      .getList('galeri/kategori')
      .then((res) => {
        const options = (res.data || []).map((item) => ({
          value: String(item.id),
          label: item.nama,
        }));
        setKategori(options);
        if (options[0]) {
          setKategoriId(options[0].value);
        }
      })
      .catch(() => {
        toast.error('Gagal memuat kategori galeri');
      });
  }, [toast]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!judulFoto || !kategoriId || !foto) {
      toast.error('Judul, kategori, dan foto wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('judul_foto', judulFoto);
      formData.append('keterangan', keterangan);
      formData.append('kategori_id', kategoriId);
      formData.append('link_gdrive', linkGdrive);
      formData.append('status', status);
      formData.append('foto', foto);
      if (tanggalKegiatan) {
        formData.append('tanggal_kegiatan', tanggalKegiatan);
      }

      await adminAPI.create('galeri', formData);
      toast.success('Galeri berhasil ditambahkan');
      router.push('/admin/galeri');
    } catch (error) {
      toast.error(error.message || 'Gagal menambahkan galeri');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: 'var(--space-6)' }}>
      <form onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: 'var(--space-5)' }}>Tambah Galeri</h2>

        <FormInput
          id="judul_foto"
          label="Judul Foto"
          required
          value={judulFoto}
          onChange={(event) => setJudulFoto(event.target.value)}
          placeholder="Masukkan judul foto"
        />

        <FormTextarea
          id="keterangan"
          label="Keterangan"
          value={keterangan}
          onChange={(event) => setKeterangan(event.target.value)}
          placeholder="Keterangan foto atau kegiatan"
          rows={5}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <FormSelect
            id="kategori"
            label="Kategori"
            required
            value={kategoriId}
            onChange={(event) => setKategoriId(event.target.value)}
            options={kategori.length ? kategori : [{ value: '', label: 'Tidak ada kategori' }]}
          />

          <FormSelect
            id="status"
            label="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
            ]}
          />
        </div>

        <FormInput
          id="tanggal_kegiatan"
          type="date"
          label="Tanggal Kegiatan"
          value={tanggalKegiatan}
          onChange={(event) => setTanggalKegiatan(event.target.value)}
        />

        <FormInput
          id="link_gdrive"
          type="url"
          label="Link Google Drive"
          value={linkGdrive}
          onChange={(event) => setLinkGdrive(event.target.value)}
          placeholder="https://drive.google.com/..."
        />

        <FormFileUpload
          id="foto"
          label="Foto"
          required
          accept="image/*"
          file={foto}
          onChange={setFoto}
          onRemove={() => setFoto(null)}
        />

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          <Link href="/admin/galeri" className="btn btn-secondary">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
