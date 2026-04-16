'use client';

import { useRef } from 'react';

export default function FormFileUpload({
  id,
  label,
  required,
  error,
  hint,
  accept,
  file,
  onChange,
  onRemove,
}) {
  const inputRef = useRef(null);

  return (
    <div className="form-group">
      {label ? (
        <label className="form-label" htmlFor={id}>
          {label}
          {required ? <span className="required">*</span> : null}
        </label>
      ) : null}

      <div
        className={`file-upload-zone ${file ? 'has-file' : ''}`}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={(event) => onChange?.(event.target.files?.[0] || null)}
        />

        <div className="file-upload-icon">+</div>

        {file ? (
          <p className="file-upload-text">
            File dipilih: <strong>{file.name}</strong>
          </p>
        ) : (
          <p className="file-upload-text">
            Klik untuk memilih file atau drag and drop
          </p>
        )}
      </div>

      {file && onRemove ? (
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          style={{ marginTop: 'var(--space-2)' }}
          onClick={onRemove}
        >
          Hapus file
        </button>
      ) : null}

      {error ? <p className="form-error">{error}</p> : null}
      {!error && hint ? <p className="form-hint">{hint}</p> : null}
    </div>
  );
}
