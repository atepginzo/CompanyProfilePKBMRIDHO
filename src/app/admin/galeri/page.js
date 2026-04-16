'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import { formatDate } from '@/lib/format';
import DataTable from '@/components/admin/DataTable';
import SearchFilter from '@/components/admin/SearchFilter';
import StatusBadge from '@/components/admin/StatusBadge';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { useToast } from '@/context/ToastContext';

const PAGE_SIZE = 10;

export default function GaleriPage() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(PAGE_SIZE));
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    return params.toString();
  }, [page, search, status]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getList('galeri', queryString);
      setItems(response.data || []);
      setPagination(response.pagination || null);
    } catch {
      toast.error('Gagal mengambil data galeri');
    } finally {
      setLoading(false);
    }
  }, [queryString, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await adminAPI.delete('galeri', deleteId);
      toast.success('Galeri berhasil dihapus');
      setDeleteId(null);
      loadData();
    } catch {
      toast.error('Gagal menghapus galeri');
    }
  };

  const columns = [
    {
      key: 'judulFoto',
      label: 'Judul',
      render: (item) => (
        <div>
          <div style={{ fontWeight: 600 }}>{item.judulFoto}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)' }}>
            {item.kategori?.nama || '-'}
          </div>
        </div>
      ),
    },
    {
      key: 'tanggalKegiatan',
      label: 'Tanggal Kegiatan',
      render: (item) => formatDate(item.tanggalKegiatan || item.createdAt),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <div>
      <SearchFilter
        searchValue={search}
        onSearchChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
        searchPlaceholder="Cari judul galeri..."
        filters={[
          {
            key: 'status',
            value: status,
            onChange: (value) => {
              setPage(1);
              setStatus(value);
            },
            options: [
              { value: '', label: 'Semua status' },
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
            ],
          },
        ]}
        rightAction={
          <Link href="/admin/galeri/tambah" className="btn btn-primary">
            Tambah Galeri
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        emptyTitle="Belum ada galeri"
        emptyDescription="Mulai dengan menambahkan item galeri pertama."
        actions={(item) => (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href={`/admin/galeri/edit/${item.id}`} className="btn btn-secondary btn-sm">
              Edit
            </Link>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => setDeleteId(item.id)}>
              Hapus
            </button>
          </div>
        )}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Hapus Galeri"
        message="Data galeri yang dihapus tidak dapat dikembalikan."
        confirmText="Ya, Hapus"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
