'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import FormInput from '@/components/admin/FormInput';
import FormTextarea from '@/components/admin/FormTextarea';
import FormSelect from '@/components/admin/FormSelect';
import FormFileUpload from '@/components/admin/FormFileUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useToast } from '@/context/ToastContext';

const stripHtml = (html) => String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export default function TambahBeritaPage() {
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [kategori, setKategori] = useState([]);

  const [judul, setJudul] = useState('');
  const [ringkasan, setRingkasan] = useState('');
  const [konten, setKonten] = useState('');
  const [kategoriId, setKategoriId] = useState('');
  const [penulis, setPenulis] = useState('');
  const [status, setStatus] = useState('draft');
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    adminAPI
      .getList('berita/kategori')
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
        toast.error('Gagal memuat kategori berita');
      });
  }, [toast]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!judul || !ringkasan || !konten || !kategoriId) {
      toast.error('Lengkapi seluruh field wajib');
      return;
    }

    if (stripHtml(konten).length < 50) {
      toast.error('Konten wajib diisi (minimal 50 karakter teks)');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('judul', judul);
      formData.append('ringkasan', ringkasan);
      formData.append('konten', konten);
      formData.append('kategori_id', kategoriId);
      formData.append('penulis', penulis);
      formData.append('status', status);
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      await adminAPI.create('berita', formData);
      toast.success('Berita berhasil ditambahkan');
      router.push('/admin/berita');
    } catch (error) {
      toast.error(error.message || 'Gagal menambahkan berita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: 'var(--space-6)' }}>
      <form onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: 'var(--space-5)' }}>Tambah Berita</h2>

        <FormInput
          id="judul"
          label="Judul"
          required
          value={judul}
          onChange={(event) => setJudul(event.target.value)}
          placeholder="Masukkan judul berita"
        />

        <FormTextarea
          id="ringkasan"
          label="Ringkasan"
          required
          value={ringkasan}
          onChange={(event) => setRingkasan(event.target.value)}
          placeholder="Ringkasan singkat berita"
          rows={4}
        />

        <RichTextEditor
          id="konten"
          label="Konten"
          required
          value={konten}
          onChange={setKonten}
          placeholder="Konten lengkap berita"
          hint="Gunakan toolbar untuk mengatur format konten berita."
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
          id="penulis"
          label="Penulis"
          value={penulis}
          onChange={(event) => setPenulis(event.target.value)}
          placeholder="Kosongkan untuk menggunakan nama admin"
        />

        <FormFileUpload
          id="thumbnail"
          label="Thumbnail"
          accept="image/*"
          file={thumbnail}
          onChange={setThumbnail}
          onRemove={() => setThumbnail(null)}
        />

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
          <Link href="/admin/berita" className="btn btn-secondary">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
