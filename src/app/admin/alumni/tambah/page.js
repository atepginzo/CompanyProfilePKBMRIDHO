'use client';

import CrudFormPage from '@/components/admin/CrudFormPage';

const fields = [
  { key: 'nama', label: 'Nama', required: true },
  { key: 'angkatan', label: 'Angkatan', required: true },
  { key: 'program_studi', label: 'Program Studi' },
  { key: 'tahun_lulus', label: 'Tahun Lulus' },
  { key: 'pekerjaan_saat_ini', label: 'Pekerjaan Saat Ini' },
  { key: 'perusahaan', label: 'Perusahaan' },
  {
    key: 'is_featured',
    label: 'Tampilkan sebagai Alumni Terkemuka',
    type: 'select',
    options: [
      { value: 'false', label: 'Tidak' },
      { value: 'true', label: 'Ya' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'aktif', label: 'Aktif' },
      { value: 'nonaktif', label: 'Nonaktif' },
    ],
  },
  { key: 'testimoni', label: 'Testimoni', type: 'textarea', rows: 5 },
];

export default function TambahAlumniPage() {
  return (
    <CrudFormPage
      mode="create"
      resource="alumni"
      title="Tambah Alumni"
      backHref="/admin/alumni"
      fields={fields}
      initialValues={{ status: 'aktif', is_featured: 'false' }}
      toPayload={(v) => ({ ...v, is_featured: v.is_featured === 'true' })}
      validate={(v) => {
        if ((v.nama || '').trim().length < 3) return 'Nama minimal 3 karakter';
        if (!/^\d{4}$/.test((v.angkatan || '').trim())) return 'Angkatan harus 4 digit';
        return '';
      }}
    />
  );
}
