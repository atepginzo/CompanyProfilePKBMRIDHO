'use client';

export default function FormInput({
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

      <input
        id={id}
        className={`form-input ${error ? 'error' : ''} ${className}`.trim()}
        {...props}
      />

      {error ? <p className="form-error">{error}</p> : null}
      {!error && hint ? <p className="form-hint">{hint}</p> : null}
    </div>
  );
}
