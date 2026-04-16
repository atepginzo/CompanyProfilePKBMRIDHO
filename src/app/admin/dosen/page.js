'use client';

import CrudListPage from '@/components/admin/CrudListPage';
import StatusBadge from '@/components/admin/StatusBadge';

const columns = [
  { key: 'namaLengkap', label: 'Nama', render: (row) => row.namaLengkap || '-' },
  { key: 'programStudi', label: 'Prodi', render: (row) => row.programStudi || '-' },
  { key: 'nip', label: 'NIP', render: (row) => row.nip || '-' },
  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
];

export default function DosenPage() {
  return (
    <CrudListPage
      resource="dosen"
      searchPlaceholder="Cari nama dosen, NIP, atau NIDN..."
      createHref="/admin/dosen/tambah"
      createLabel="Tambah Dosen"
      columns={columns}
      statusFilter={[
        { value: '', label: 'Semua Status' },
        { value: 'aktif', label: 'Aktif' },
        { value: 'nonaktif', label: 'Nonaktif' },
      ]}
      extraFilters={[
        {
          key: 'program_studi',
          options: [
            { value: '', label: 'Semua Prodi' },
            { value: 'Teknik Informatika', label: 'Teknik Informatika' },
            { value: 'Sistem Informasi', label: 'Sistem Informasi' },
          ],
        },
      ]}
      emptyTitle="Belum ada data dosen"
      emptyDescription="Tambahkan data dosen pertama untuk ditampilkan pada profil kampus."
      deleteDialog={{
        title: 'Hapus Dosen',
        message: 'Data dosen yang dihapus tidak dapat dikembalikan.',
      }}
    />
  );
}
