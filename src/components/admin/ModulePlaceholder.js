'use client';

import Link from 'next/link';

export default function ModulePlaceholder({ title, description }) {
  return (
    <div className="card" style={{ padding: 'var(--space-8)' }}>
      <h2 style={{ marginBottom: 'var(--space-3)' }}>{title}</h2>
      <p style={{ color: 'var(--color-neutral-600)', marginBottom: 'var(--space-5)' }}>
        {description || 'Halaman ini sudah disiapkan dan akan dilengkapi CRUD penuh pada fase berikutnya.'}
      </p>
      <Link href="/admin/dashboard" className="btn btn-secondary">
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
