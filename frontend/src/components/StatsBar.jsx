export default function StatsBar({ results, onDownload }) {
  const total = results.length;
  const valid = results.filter((r) => r.status === "valid").length;
  const risky = results.filter((r) => r.status === "risky").length;
  const invalid = results.filter((r) => r.status === "invalid").length;
  const pct = (n) => total ? Math.round((n / total) * 100) : 0;

  return (
    <div className="stats-wrap">
      <div className="stats-bar">
        <div className="stat">
          <div className="stat-num" style={{ color: "#ededed" }}>{total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <div className="stat-num" style={{ color: "#10b981" }}>{valid}</div>
          <div className="stat-label">Valid — {pct(valid)}%</div>
        </div>
        <div className="stat">
          <div className="stat-num" style={{ color: "#f59e0b" }}>{risky}</div>
          <div className="stat-label">Risky — {pct(risky)}%</div>
        </div>
        <div className="stat">
          <div className="stat-num" style={{ color: "#ef4444" }}>{invalid}</div>
          <div className="stat-label">Invalid — {pct(invalid)}%</div>
        </div>

        <div className="progress-bar-wrap">
          <div className="progress-bar">
            <div style={{ width: pct(valid) + "%", background: "#10b981", height: "100%", borderRadius: "4px 0 0 4px", transition: "width 0.6s" }} />
            <div style={{ width: pct(risky) + "%", background: "#f59e0b", height: "100%" }} />
            <div style={{ width: pct(invalid) + "%", background: "#ef4444", height: "100%", borderRadius: "0 4px 4px 0" }} />
          </div>
        </div>

        <button className="dl-btn" onClick={onDownload}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Download clean list
        </button>
      </div>

      <style>{`
        .stats-wrap { margin-bottom: 1.25rem; }
        .stats-bar {
          background: #111; border: 1px solid #2a2a2a;
          border-radius: 14px; padding: 1.25rem 1.5rem;
          display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;
        }
        .stat { min-width: 72px; }
        .stat-num { font-size: 1.6rem; font-weight: 600; letter-spacing: -0.02em; line-height: 1; }
        .stat-label { font-size: 11px; color: #555; margin-top: 4px; white-space: nowrap; }
        .stat-divider { width: 1px; height: 36px; background: #2a2a2a; flex-shrink: 0; }
        .progress-bar-wrap { flex: 1; min-width: 120px; }
        .progress-bar { height: 6px; background: #1a1a1a; border-radius: 4px; display: flex; overflow: hidden; }
        .dl-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 0.55rem 1.1rem;
          background: #6366f1; color: #fff;
          border: none; border-radius: 10px;
          font-size: 13px; font-weight: 500;
          cursor: pointer; transition: background 0.15s;
          white-space: nowrap;
        }
        .dl-btn:hover { background: #4f46e5; }
      `}</style>
    </div>
  );
}