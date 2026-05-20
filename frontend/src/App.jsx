import { useState } from "react";
import UploadSection from "./components/UploadSection";
import ResultsTable from "./components/ResultsTable";
import StatsBar from "./components/StatsBar";
import "./App.css";

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleUpload = async (file) => {
    setFileName(file.name);
    setLoading(true);
    setResults([]);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:8081/verify", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResults(data);
    } catch {
      alert("Could not connect to backend. Make sure it is running on port 8081.");
    } finally {
      setLoading(false);
    }
  };

  const downloadClean = () => {
    const clean = results.filter((r) => r.status === "valid");
    const csv = ["email,status,reason", ...clean.map((r) => `${r.email},${r.status},${r.reason}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "clean-emails.csv";
    a.click();
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-mark">✉</div>
            <span className="logo-text">EmailVerifier</span>
          </div>
          <div className="header-badges">
            <span className="badge">Rust + React</span>
            <span className="badge badge-live">Live</span>
          </div>
        </div>
      </header>

      <main className="main">
  <div className="hero">
    <div className="hero-eyebrow">Email deliverability tool</div>

    <h1>
      Verify emails at
      <br />
      <span>scale, instantly</span>
    </h1>

    <p className="hero-text">
      Upload a CSV and get a full deliverability report — syntax check,
      MX records, disposable domains, and role-based address detection.
      <span className="rust-highlight"> Powered by Rust.</span>
    </p>

    <div className="checks-row">
      <span className="check-pill">Syntax validation</span>
      <span className="check-pill">MX record lookup</span>
      <span className="check-pill">Disposable domains</span>
      <span className="check-pill">Role-based detection</span>
      <span className="check-pill">CSV export</span>
    </div>
  </div>

        <UploadSection onUpload={handleUpload} loading={loading} fileName={fileName} />

        {results.length > 0 && (
          <>
            <StatsBar results={results} onDownload={downloadClean} />
            <ResultsTable results={results} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;