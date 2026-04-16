'use client';

import CrudFormPage from '@/components/admin/CrudFormPage';

const fields = [
  { key: 'nama_lengkap', label: 'Nama Lengkap', required: true },
  { key: 'nip', label: 'NIP' },
  { key: 'nidn', label: 'NIDN' },
  { key: 'program_studi', label: 'Program Studi' },
  { key: 'jabatan_fungsional', label: 'Jabatan Fungsional' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'telepon', label: 'Telepon' },
  { key: 'urutan', label: 'Urutan', type: 'number' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'aktif', label: 'Aktif' },
      { value: 'nonaktif', label: 'Nonaktif' },
    ],
  },
  { key: 'bio', label: 'Bio', type: 'textarea', rows: 6 },
];

export default function TambahDosenPage() {
  return (
    <CrudFormPage
      mode="create"
      resource="dosen"
      title="Tambah Dosen"
      backHref="/admin/dosen"
      fields={fields}
      initialValues={{ status: 'aktif', urutan: '0' }}
      toPayload={(v) => ({ ...v, urutan: parseInt(v.urutan || '0', 10) || 0 })}
      validate={(v) => (v.nama_lengkap || '').trim().length < 3 ? 'Nama dosen minimal 3 karakter' : ''}
    />
  );
}
