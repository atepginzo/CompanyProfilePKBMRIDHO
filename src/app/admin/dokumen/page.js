'use client';

import CrudListPage from '@/components/admin/CrudListPage';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatFileSize } from '@/lib/format';

const columns = [
  { key: 'judulDokumen', label: 'Judul Dokumen', render: (row) => row.judulDokumen || '-' },
  { key: 'kategori', label: 'Kategori', render: (row) => row.kategori || '-' },
  { key: 'ukuranFile', label: 'Ukuran', render: (row) => formatFileSize(row.ukuranFile || 0) },
  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
];

export default function DokumenPage() {
  return (
    <CrudListPage
      resource="dokumen"
      searchPlaceholder="Cari judul atau deskripsi dokumen..."
      createHref="/admin/dokumen/tambah"
      createLabel="Tambah Dokumen"
      columns={columns}
      statusFilter={[
        { value: '', label: 'Semua Status' },
        { value: 'aktif', label: 'Aktif' },
        { value: 'nonaktif', label: 'Nonaktif' },
      ]}
      extraFilters={[
        {
          key: 'visibilitas',
          options: [
            { value: '', label: 'Semua Visibilitas' },
            { value: 'publik', label: 'Publik' },
            { value: 'internal', label: 'Internal' },
          ],
        },
      ]}
      emptyTitle="Belum ada dokumen"
      emptyDescription="Tambahkan dokumen untuk diakses pengguna sesuai visibilitas."
      deleteDialog={{
        title: 'Hapus Dokumen',
        message: 'Dokumen yang dihapus tidak dapat dikembalikan.',
      }}
    />
  );
}
