'use client';

import CrudListPage from '@/components/admin/CrudListPage';
import StatusBadge from '@/components/admin/StatusBadge';

const columns = [
  { key: 'nama', label: 'Nama', render: (row) => row.nama || '-' },
  { key: 'angkatan', label: 'Angkatan', render: (row) => row.angkatan || '-' },
  { key: 'pekerjaanSaatIni', label: 'Pekerjaan', render: (row) => row.pekerjaanSaatIni || '-' },
  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
];

export default function AlumniPage() {
  return (
    <CrudListPage
      resource="alumni"
      searchPlaceholder="Cari alumni berdasarkan nama atau pekerjaan..."
      createHref="/admin/alumni/tambah"
      createLabel="Tambah Alumni"
      columns={columns}
      statusFilter={[
        { value: '', label: 'Semua Status' },
        { value: 'aktif', label: 'Aktif' },
        { value: 'nonaktif', label: 'Nonaktif' },
      ]}
      extraFilters={[
        {
          key: 'angkatan',
          options: [
            { value: '', label: 'Semua Angkatan' },
            { value: '2020', label: '2020' },
            { value: '2021', label: '2021' },
            { value: '2022', label: '2022' },
            { value: '2023', label: '2023' },
          ],
        },
      ]}
      emptyTitle="Belum ada data alumni"
      emptyDescription="Tambahkan profil alumni untuk memperkuat branding kampus."
      deleteDialog={{
        title: 'Hapus Alumni',
        message: 'Data alumni yang dihapus tidak dapat dikembalikan.',
      }}
    />
  );
}
