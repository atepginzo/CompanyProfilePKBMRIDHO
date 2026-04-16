'use client';

export default function FormSelect({
  id,
  label,
  required,
  error,
  hint,
  options = [],
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

      <select
        id={id}
        className={`form-select ${error ? 'error' : ''} ${className}`.trim()}
        {...props}
      >
        {options.map((option) => (
          <option key={`${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? <p className="form-error">{error}</p> : null}
      {!error && hint ? <p className="form-hint">{hint}</p> : null}
    </div>
  );
}
