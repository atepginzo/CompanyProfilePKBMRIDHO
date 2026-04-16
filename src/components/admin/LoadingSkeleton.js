'use client';

export default function LoadingSkeleton({ rows = 5, columns = 4 }) {
  const headWidths = ['72%', '68%', '80%', '64%', '76%', '70%'];
  const bodyWidths = ['60%', '75%', '55%', '82%', '66%', '70%'];

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i}><div className="skeleton skeleton-text" style={{ width: headWidths[i % headWidths.length] }} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: columns }).map((_, c) => (
                <td key={c}><div className="skeleton skeleton-text" style={{ width: bodyWidths[(r + c) % bodyWidths.length] }} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
