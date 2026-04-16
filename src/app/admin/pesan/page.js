'use client';

import CrudListPage from '@/components/admin/CrudListPage';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatDateTime } from '@/lib/format';

const columns = [
  { key: 'namaPengirim', label: 'Pengirim', render: (row) => row.namaPengirim || '-' },
  { key: 'emailPengirim', label: 'Email', render: (row) => row.emailPengirim || '-' },
  { key: 'subjek', label: 'Subjek', render: (row) => row.subjek || '-' },
  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  { key: 'createdAt', label: 'Masuk', render: (row) => formatDateTime(row.createdAt) },
];

export default function PesanPage() {
  return (
    <CrudListPage
      resource="pesan"
      searchPlaceholder="Cari nama, email, atau subjek pesan..."
      columns={columns}
      statusFilter={[
        { value: '', label: 'Semua Status' },
        { value: 'unread', label: 'Belum Dibaca' },
        { value: 'read', label: 'Sudah Dibaca' },
        { value: 'archived', label: 'Arsip' },
      ]}
      extraFilters={[
        {
          key: 'tipe_pesan',
          options: [
            { value: '', label: 'Semua Tipe' },
            { value: 'kontak', label: 'Kontak' },
            { value: 'pengaduan', label: 'Pengaduan' },
            { value: 'saran', label: 'Saran' },
          ],
        },
      ]}
      emptyTitle="Belum ada pesan masuk"
      emptyDescription="Pesan dari halaman kontak akan muncul di sini."
      deleteDialog={{
        title: 'Hapus Pesan',
        message: 'Pesan yang dihapus tidak dapat dikembalikan.',
      }}
    />
  );
}
