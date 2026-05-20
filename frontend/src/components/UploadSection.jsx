import { useRef, useState } from "react";

export default function UploadSection({ onUpload, loading, fileName }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (file && file.name.endsWith(".csv")) onUpload(file);
    else alert("Please upload a .csv file");
  };

  return (
    <>
      <div
        className={`upload-box ${dragging ? "dragging" : ""} ${loading ? "loading" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => !loading && inputRef.current.click()}
      >
        <input ref={inputRef} type="file" accept=".csv"
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files[0])} />

        {loading ? (
          <div className="upload-loading">
            <div className="spinner" />
            <div>
              <p className="upload-loading-title">Verifying emails...</p>
              <p className="upload-loading-sub">Running DNS lookups and domain checks</p>
            </div>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon-wrap">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12V3M8 7l4-4 4 4"/>
              </svg>
            </div>
            <div>
              <p className="upload-title">
                {fileName ? `Re-upload: ${fileName}` : "Drop your CSV file here"}
              </p>
              <p className="upload-sub">or click to browse — we auto-detect the email column</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .upload-box {
          border: 1px dashed #2a2a2a;
          border-radius: 14px;
          background: #111111;
          padding: 2.5rem 2rem;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          margin-bottom: 1.5rem;
        }
        .upload-box:hover, .upload-box.dragging {
          border-color: #6366f1;
          background: #13123a;
        }
        .upload-box.loading { cursor: default; border-style: solid; border-color: #2a2a2a; }
        .upload-content { display: flex; align-items: center; gap: 1.25rem; }
        .upload-icon-wrap {
          width: 48px; height: 48px; border-radius: 12px;
          background: #1a1a1a; border: 1px solid #2a2a2a;
          display: flex; align-items: center; justify-content: center;
          color: #6366f1; flex-shrink: 0;
        }
        .upload-title { font-size: 0.95rem; font-weight: 500; color: #ededed; margin-bottom: 4px; }
        .upload-sub { font-size: 0.82rem; color: #555; }
        .upload-loading { display: flex; align-items: center; gap: 1.25rem; }
        .upload-loading-title { font-size: 0.95rem; font-weight: 500; color: #ededed; margin-bottom: 4px; }
        .upload-loading-sub { font-size: 0.82rem; color: #555; }
        .spinner {
          width: 32px; height: 32px; flex-shrink: 0;
          border: 2px solid #2a2a2a;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}