'use client';

import CrudListPage from '@/components/admin/CrudListPage';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatDateTime } from '@/lib/format';

const columns = [
  { key: 'judulEvent', label: 'Event', render: (row) => row.judulEvent || '-' },
  { key: 'jenisEvent', label: 'Jenis', render: (row) => row.jenisEvent || '-' },
  { key: 'tanggalMulai', label: 'Mulai', render: (row) => formatDateTime(row.tanggalMulai) },
  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
];

export default function KalenderPage() {
  return (
    <CrudListPage
      resource="kalender"
      searchPlaceholder="Cari event kalender..."
      createHref="/admin/kalender/tambah"
      createLabel="Tambah Event"
      columns={columns}
      statusFilter={[
        { value: '', label: 'Semua Status' },
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
      ]}
      extraFilters={[
        {
          key: 'jenis_event',
          options: [
            { value: '', label: 'Semua Jenis' },
            { value: 'akademik', label: 'Akademik' },
            { value: 'non_akademik', label: 'Non Akademik' },
            { value: 'umum', label: 'Umum' },
          ],
        },
      ]}
      emptyTitle="Belum ada event kalender"
      emptyDescription="Tambahkan event pertama untuk kalender akademik dan kegiatan kampus."
      deleteDialog={{
        title: 'Hapus Event',
        message: 'Event kalender yang dihapus tidak dapat dikembalikan.',
      }}
    />
  );
}
