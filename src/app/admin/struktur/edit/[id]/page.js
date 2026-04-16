'use client';

import CrudFormPage from '@/components/admin/CrudFormPage';

const fields = [
  { key: 'nama_pejabat', label: 'Nama Pejabat', required: true },
  { key: 'jabatan', label: 'Jabatan', required: true },
  { key: 'level', label: 'Level', type: 'number', required: true },
  { key: 'parent_id', label: 'Parent ID', type: 'number' },
  { key: 'urutan', label: 'Urutan', type: 'number' },
  { key: 'periode', label: 'Periode' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'aktif', label: 'Aktif' },
      { value: 'nonaktif', label: 'Nonaktif' },
    ],
  },
];

export default function EditStrukturPage() {
  return (
    <CrudFormPage
      mode="edit"
      resource="struktur"
      title="Edit Struktur Organisasi"
      backHref="/admin/struktur"
      fields={fields}
      initialValues={{ level: '1', urutan: '0', status: 'aktif' }}
      fromData={(d) => ({
        nama_pejabat: d.namaPejabat || '',
        jabatan: d.jabatan || '',
        level: String(d.level ?? 1),
        parent_id: d.parentId ? String(d.parentId) : '',
        urutan: String(d.urutan ?? 0),
        periode: d.periode || '',
        status: d.status || 'aktif',
      })}
      toPayload={(v) => ({
        ...v,
        level: parseInt(v.level || '1', 10) || 1,
        parent_id: v.parent_id ? parseInt(v.parent_id, 10) : null,
        urutan: parseInt(v.urutan || '0', 10) || 0,
      })}
      validate={(v) => {
        if (!(v.nama_pejabat || '').trim()) return 'Nama pejabat wajib diisi';
        if (!(v.jabatan || '').trim()) return 'Jabatan wajib diisi';
        return '';
      }}
    />
  );
}
