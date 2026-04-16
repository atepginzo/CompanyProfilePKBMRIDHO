'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';
import DataTable from '@/components/admin/DataTable';
import SearchFilter from '@/components/admin/SearchFilter';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { useToast } from '@/context/ToastContext';

const PAGE_SIZE = 10;

export default function CrudListPage({
  resource,
  searchPlaceholder,
  createHref,
  createLabel,
  columns,
  statusFilter = null,
  extraFilters = [],
  emptyTitle,
  emptyDescription,
  deleteDialog = {},
}) {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [customFilters, setCustomFilters] = useState(() =>
    extraFilters.reduce((acc, item) => {
      acc[item.key] = item.defaultValue || '';
      return acc;
    }, {})
  );

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(PAGE_SIZE));
    if (search) params.set('search', search);
    if (status) params.set('status', status);

    Object.entries(customFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    return params.toString();
  }, [page, search, status, customFilters]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getList(resource, queryString);
      setItems(response.data || []);
      setPagination(response.pagination || null);
    } catch {
      toast.error('Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  }, [resource, queryString, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await adminAPI.delete(resource, deleteId);
      toast.success('Data berhasil dihapus');
      setDeleteId(null);
      loadData();
    } catch {
      toast.error('Gagal menghapus data');
    }
  };

  const filters = [];
  if (statusFilter) {
    filters.push({
      key: 'status',
      value: status,
      onChange: (value) => {
        setPage(1);
        setStatus(value);
      },
      options: statusFilter,
    });
  }

  extraFilters.forEach((filter) => {
    filters.push({
      key: filter.key,
      value: customFilters[filter.key] || '',
      onChange: (value) => {
        setPage(1);
        setCustomFilters((prev) => ({ ...prev, [filter.key]: value }));
      },
      options: filter.options,
    });
  });

  return (
    <div>
      <SearchFilter
        searchValue={search}
        onSearchChange={(value) => {
          setPage(1);
          setSearch(value);
        }}
        searchPlaceholder={searchPlaceholder || 'Cari data...'}
        filters={filters}
        rightAction={
          createHref ? (
            <Link href={createHref} className="btn btn-primary">
              {createLabel || 'Tambah Data'}
            </Link>
          ) : null
        }
      />

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        pagination={pagination}
        onPageChange={setPage}
        emptyTitle={emptyTitle || 'Belum ada data'}
        emptyDescription={emptyDescription || 'Tambah data pertama untuk modul ini.'}
        actions={(item) => (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link href={`/admin/${resource}/edit/${item.id}`} className="btn btn-secondary btn-sm">
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
        title={deleteDialog.title || 'Hapus Data'}
        message={deleteDialog.message || 'Data yang dihapus tidak dapat dikembalikan.'}
        confirmText={deleteDialog.confirmText || 'Ya, Hapus'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
