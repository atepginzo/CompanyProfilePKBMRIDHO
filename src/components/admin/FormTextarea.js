'use client';

export default function FormTextarea({
  id,
  label,
  required,
  error,
  hint,
  className = '',
  ...props
}) {
  return (
    <div className="form-group">
      {label ? (
        <label className="form-label" htmlFor={id}>
          {label}
          {required ? <span className="required">*</span> : null}
        </label>
      ) : null}

      <textarea
        id={id}
        className={`form-textarea ${error ? 'error' : ''} ${className}`.trim()}
        {...props}
      />

      {error ? <p className="form-error">{error}</p> : null}
      {!error && hint ? <p className="form-hint">{hint}</p> : null}
    </div>
  );
}
