'use client';

import CrudListPage from '@/components/admin/CrudListPage';
import StatusBadge from '@/components/admin/StatusBadge';

const columns = [
  { key: 'namaPejabat', label: 'Nama Pejabat', render: (row) => row.namaPejabat || '-' },
  { key: 'jabatan', label: 'Jabatan', render: (row) => row.jabatan || '-' },
  { key: 'level', label: 'Level', render: (row) => row.level ?? '-' },
  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
];

export default function StrukturPage() {
  return (
    <CrudListPage
      resource="struktur"
      searchPlaceholder="Cari nama pejabat atau jabatan..."
      createHref="/admin/struktur/tambah"
      createLabel="Tambah Struktur"
      columns={columns}
      statusFilter={[
        { value: '', label: 'Semua Status' },
        { value: 'aktif', label: 'Aktif' },
        { value: 'nonaktif', label: 'Nonaktif' },
      ]}
      extraFilters={[
        {
          key: 'level',
          options: [
            { value: '', label: 'Semua Level' },
            { value: '1', label: 'Level 1' },
            { value: '2', label: 'Level 2' },
            { value: '3', label: 'Level 3' },
          ],
        },
      ]}
      emptyTitle="Belum ada struktur organisasi"
      emptyDescription="Tambahkan data struktur organisasi kampus."
      deleteDialog={{
        title: 'Hapus Struktur Organisasi',
        message: 'Data struktur yang dihapus tidak dapat dikembalikan.',
      }}
    />
  );
}
