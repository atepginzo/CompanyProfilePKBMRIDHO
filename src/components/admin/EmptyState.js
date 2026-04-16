'use client';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon || (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
      )}</div>
      <h3 className="empty-state-title">{title || 'Belum ada data'}</h3>
      <p className="empty-state-desc">{description || 'Data yang Anda cari belum tersedia.'}</p>
      {action && action}
    </div>
  );
}
