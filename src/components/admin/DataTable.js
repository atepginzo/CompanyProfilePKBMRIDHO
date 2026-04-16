'use client';

import LoadingSkeleton from '@/components/admin/LoadingSkeleton';
import EmptyState from '@/components/admin/EmptyState';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyTitle,
  emptyDescription,
  emptyAction,
  rowKey = 'id',
  actions,
  pagination,
  onPageChange,
}) {
  if (loading) {
    return <LoadingSkeleton rows={5} columns={Math.max(columns.length + (actions ? 1 : 0), 3)} />;
  }

  if (!data.length) {
    return (
      <div className="card">
        <EmptyState
          title={emptyTitle || 'Belum ada data'}
          description={emptyDescription || 'Data akan muncul di sini setelah Anda menambahkan konten.'}
          action={emptyAction}
        />
      </div>
    );
  }

  return (
    <>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              {actions ? <th>Aksi</th> : null}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const key = item[rowKey] ?? `${index}`;

              return (
                <tr key={key}>
                  {columns.map((column) => (
                    <td key={`${key}-${column.key}`} className={column.className || ''}>
                      {column.render ? column.render(item, index) : item[column.key] ?? '-'}
                    </td>
                  ))}
                  {actions ? <td>{actions(item, index)}</td> : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination ? (
        <div className="pagination">
          <button
            type="button"
            className="pagination-btn"
            onClick={() => onPageChange?.(pagination.page - 1)}
            disabled={pagination.page <= 1}
            aria-label="Halaman sebelumnya"
          >
            &lt;
          </button>

          {Array.from({ length: pagination.totalPages || 1 }).map((_, idx) => {
            const page = idx + 1;
            return (
              <button
                type="button"
                key={`page-${page}`}
                className={`pagination-btn ${pagination.page === page ? 'active' : ''}`}
                onClick={() => onPageChange?.(page)}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            className="pagination-btn"
            onClick={() => onPageChange?.(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            aria-label="Halaman berikutnya"
          >
            &gt;
          </button>

          <span className="pagination-info">
            Total: {pagination.total || 0}
          </span>
        </div>
      ) : null}
    </>
  );
}
