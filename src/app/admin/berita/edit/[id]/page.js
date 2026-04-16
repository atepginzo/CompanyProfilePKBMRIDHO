'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import FormInput from '@/components/admin/FormInput';
import FormTextarea from '@/components/admin/FormTextarea';
import FormSelect from '@/components/admin/FormSelect';
import FormFileUpload from '@/components/admin/FormFileUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { useToast } from '@/context/ToastContext';

const stripHtml = (html) => String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export default function EditBeritaPage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [kategori, setKategori] = useState([]);

  const [judul, setJudul] = useState('');
  const [ringkasan, setRingkasan] = useState('');
  const [konten, setKonten] = useState('');
  const [kategoriId, setKategoriId] = useState('');
  const [penulis, setPenulis] = useState('');
  const [status, setStatus] = useState('draft');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailSaatIni, setThumbnailSaatIni] = useState('');

  const kategoriOptions = useMemo(
    () => (kategori.length ? kategori : [{ value: '', label: 'Tidak ada kategori' }]),
    [kategori]
  );

  useEffect(() => {
    let mounted = true;

    Promise.all([adminAPI.getList('berita/kategori'), adminAPI.getOne('berita', params.id)])
      .then(([kategoriRes, beritaRes]) => {
        if (!mounted) return;

        const options = (kategoriRes.data || []).map((item) => ({
          value: String(item.id),
          label: item.nama,
        }));
        setKategori(options);

        const berita = beritaRes.data;
        setJudul(berita.judul || '');
        setRingkasan(berita.ringkasan || '');
        setKonten(berita.konten || '');
        setKategoriId(String(berita.kategoriId || options[0]?.value || ''));
        setPenulis(berita.penulis || '');
        setStatus(berita.status || 'draft');
        setThumbnailSaatIni(berita.thumbnail || '');
      })
      .catch(() => {
        toast.error('Gagal memuat data berita');
        router.push('/admin/berita');
      })
      .finally(() => {
        if (mounted) setInitialLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [params.id, router, toast]);

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

      await adminAPI.update('berita', params.id, formData);
      toast.success('Berita berhasil diperbarui');
      router.push('/admin/berita');
    } catch (error) {
      toast.error(error.message || 'Gagal memperbarui berita');
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
        <h2 style={{ marginBottom: 'var(--space-5)' }}>Edit Berita</h2>

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
            options={kategoriOptions}
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
          label="Ganti Thumbnail"
          accept="image/*"
          file={thumbnail}
          onChange={setThumbnail}
          onRemove={() => setThumbnail(null)}
          hint={thumbnailSaatIni ? `Thumbnail saat ini: ${thumbnailSaatIni}` : 'Belum ada thumbnail'}
        />

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Update'}
          </button>
          <Link href="/admin/berita" className="btn btn-secondary">
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
