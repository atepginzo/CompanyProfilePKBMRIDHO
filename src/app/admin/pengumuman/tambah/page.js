'use client';

import CrudFormPage from '@/components/admin/CrudFormPage';

const fields = [
  { key: 'judul', label: 'Judul', required: true },
  { key: 'konten', label: 'Konten', type: 'richtext', required: true, hint: 'Gunakan toolbar untuk format teks pengumuman.' },
  {
    key: 'prioritas',
    label: 'Prioritas',
    type: 'select',
    options: [
      { value: 'normal', label: 'Normal' },
      { value: 'penting', label: 'Penting' },
      { value: 'urgent', label: 'Urgent' },
    ],
  },
  { key: 'tanggal_berlaku_mulai', label: 'Tanggal Berlaku Mulai', type: 'date' },
  { key: 'tanggal_berlaku_selesai', label: 'Tanggal Berlaku Selesai', type: 'date' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
    ],
  },
];

export default function TambahPengumumanPage() {
  return (
    <CrudFormPage
      mode="create"
      resource="pengumuman"
      title="Tambah Pengumuman"
      backHref="/admin/pengumuman"
      fields={fields}
      initialValues={{ prioritas: 'normal', status: 'draft' }}
      validate={(v) => {
        if ((v.judul || '').trim().length < 10) return 'Judul minimal 10 karakter';
        if (!(v.konten || '').trim()) return 'Konten wajib diisi';
        return '';
      }}
    />
  );
}
