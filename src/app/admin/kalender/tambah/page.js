'use client';

import CrudFormPage from '@/components/admin/CrudFormPage';

const fields = [
  { key: 'judul_event', label: 'Judul Event', required: true },
  { key: 'deskripsi', label: 'Deskripsi', type: 'textarea', rows: 6 },
  { key: 'tanggal_mulai', label: 'Tanggal Mulai', type: 'datetime-local', required: true },
  { key: 'tanggal_selesai', label: 'Tanggal Selesai', type: 'datetime-local' },
  { key: 'lokasi', label: 'Lokasi' },
  {
    key: 'jenis_event',
    label: 'Jenis Event',
    type: 'select',
    options: [
      { value: 'akademik', label: 'Akademik' },
      { value: 'non_akademik', label: 'Non Akademik' },
      { value: 'umum', label: 'Umum' },
    ],
  },
  { key: 'warna_label', label: 'Warna Label (Hex)' },
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

export default function TambahKalenderPage() {
  return (
    <CrudFormPage
      mode="create"
      resource="kalender"
      title="Tambah Event Kalender"
      backHref="/admin/kalender"
      fields={fields}
      initialValues={{ jenis_event: 'umum', status: 'draft' }}
      validate={(v) => {
        if ((v.judul_event || '').trim().length < 5) return 'Judul event minimal 5 karakter';
        if (!v.tanggal_mulai) return 'Tanggal mulai wajib diisi';
        return '';
      }}
    />
  );
}
