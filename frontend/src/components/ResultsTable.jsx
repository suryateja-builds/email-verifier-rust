const statusConfig = {
  valid:   { label: "Valid",   color: "#10b981", bg: "#052e1c", dot: "#10b981" },
  risky:   { label: "Risky",  color: "#f59e0b", bg: "#2d1f00", dot: "#f59e0b" },
  invalid: { label: "Invalid", color: "#ef4444", bg: "#2d0f0f", dot: "#ef4444" },
};

const Badge = ({ status }) => {
  const s = statusConfig[status] || statusConfig.invalid;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "3px 10px", borderRadius: "20px",
      fontSize: "12px", fontWeight: 500,
      display: "inline-flex", alignItems: "center", gap: "5px"
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {s.label}
    </span>
  );
};

const Check = ({ val }) => (
  <span style={{ color: val ? "#10b981" : "#ef4444", fontSize: "13px" }}>
    {val ? "✓" : "✗"}
  </span>
);

export default function ResultsTable({ results }) {
  return (
    <div className="table-outer">
      <div className="table-header-row">
        <span style={{ fontSize: 13, color: "#888" }}>{results.length} results</span>
      </div>
      <div className="table-scroll">
        <table className="results-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Status</th>
              <th>Reason</th>
              <th>MX</th>
              <th>Disposable</th>
              <th>Role-based</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} className={`row-${r.status}`}>
                <td className="email-cell">{r.email}</td>
                <td><Badge status={r.status} /></td>
                <td className="reason-cell">{r.reason}</td>
                <td><Check val={r.mx_found} /></td>
                <td style={{ color: r.is_disposable ? "#ef4444" : "#555", fontSize: 13 }}>
                  {r.is_disposable ? "Yes" : "No"}
                </td>
                <td style={{ color: r.is_role_based ? "#f59e0b" : "#555", fontSize: 13 }}>
                  {r.is_role_based ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .table-outer {
          background: #111; border: 1px solid #2a2a2a;
          border-radius: 14px; overflow: hidden;
        }
        .table-header-row {
          padding: 0.875rem 1.25rem;
          border-bottom: 1px solid #1a1a1a;
          display: flex; align-items: center; justify-content: space-between;
        }
        .table-scroll { overflow-x: auto; }
        .results-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 620px; }
        .results-table thead { background: #0f0f0f; }
        .results-table th {
          padding: 0.65rem 1.25rem;
          text-align: left; font-weight: 500;
          color: #555; font-size: 11px;
          border-bottom: 1px solid #1a1a1a;
          text-transform: uppercase; letter-spacing: 0.06em;
          white-space: nowrap;
        }
        .results-table td { padding: 0.75rem 1.25rem; border-bottom: 1px solid #161616; color: #aaa; }
        .results-table tr:last-child td { border-bottom: none; }
        .results-table tr:hover td { background: #141414; }
        .email-cell { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; color: #ededed; }
        .reason-cell { color: #666; max-width: 220px; }
      `}</style>
    </div>
  );
}