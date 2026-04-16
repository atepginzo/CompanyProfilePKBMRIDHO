'use client';

export default function StatusBadge({ status }) {
  const config = {
    published: { className: 'badge-success', label: 'Published' },
    draft: { className: 'badge-neutral', label: 'Draft' },
    aktif: { className: 'badge-success', label: 'Aktif' },
    nonaktif: { className: 'badge-neutral', label: 'Nonaktif' },
    normal: { className: 'badge-info', label: 'Normal' },
    penting: { className: 'badge-warning', label: 'Penting' },
    urgent: { className: 'badge-error', label: 'Urgent' },
  };

  const cfg = config[status] || { className: 'badge-neutral', label: status };

  return <span className={`badge ${cfg.className}`}>{cfg.label}</span>;
}
