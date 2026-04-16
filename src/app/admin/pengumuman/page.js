'use client';

import CrudListPage from '@/components/admin/CrudListPage';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatDate } from '@/lib/format';

const columns = [
  { key: 'judul', label: 'Judul', render: (row) => row.judul || '-' },
  { key: 'prioritas', label: 'Prioritas', render: (row) => <StatusBadge status={row.prioritas} /> },
  { key: 'tanggalBerlakuMulai', label: 'Mulai Berlaku', render: (row) => formatDate(row.tanggalBerlakuMulai) },
  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
];

export default function PengumumanPage() {
  return (
    <CrudListPage
      resource="pengumuman"
      searchPlaceholder="Cari judul atau konten pengumuman..."
      createHref="/admin/pengumuman/tambah"
      createLabel="Tambah Pengumuman"
      columns={columns}
      statusFilter={[
        { value: '', label: 'Semua Status' },
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
      ]}
      extraFilters={[
        {
          key: 'prioritas',
          options: [
            { value: '', label: 'Semua Prioritas' },
            { value: 'normal', label: 'Normal' },
            { value: 'penting', label: 'Penting' },
            { value: 'urgent', label: 'Urgent' },
          ],
        },
      ]}
      emptyTitle="Belum ada pengumuman"
      emptyDescription="Tambahkan pengumuman baru untuk ditampilkan pada pengguna."
      deleteDialog={{
        title: 'Hapus Pengumuman',
        message: 'Pengumuman yang dihapus tidak dapat dikembalikan.',
      }}
    />
  );
}
