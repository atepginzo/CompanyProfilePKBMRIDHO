'use client';

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Hapus', confirmVariant = 'danger' }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title || 'Konfirmasi'}</h3>
        <p className="modal-body">{message || 'Apakah Anda yakin ingin melakukan tindakan ini?'}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onCancel}>Batal</button>
          <button className={`btn btn-${confirmVariant}`} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
