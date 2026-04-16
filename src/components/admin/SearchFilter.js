'use client';

import { useMemo } from 'react';

export default function SearchFilter({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Cari...',
  filters = [],
  rightAction,
}) {
  const hasFilters = useMemo(() => Array.isArray(filters) && filters.length > 0, [filters]);

  return (
    <div
      className="card"
      style={{
        marginBottom: 'var(--space-5)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 'var(--space-3)',
      }}
    >
      <input
        type="text"
        className="form-input"
        value={searchValue || ''}
        onChange={(event) => onSearchChange?.(event.target.value)}
        placeholder={searchPlaceholder}
        style={{ flex: '1 1 260px', minWidth: '220px' }}
      />

      {hasFilters
        ? filters.map((filter) => (
            <select
              key={filter.key}
              className="form-select"
              value={filter.value || ''}
              onChange={(event) => filter.onChange?.(event.target.value)}
              style={{ width: '180px' }}
            >
              {(filter.options || []).map((option) => (
                <option key={`${filter.key}-${option.value}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))
        : null}

      {rightAction ? <div style={{ marginLeft: 'auto' }}>{rightAction}</div> : null}
    </div>
  );
}
