"use client";

import { useState } from "react";

export default function Home() {
  const [link, setLink] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!link) return setError("Masukkan link verifikasi SheerID.");
    if (!file) return setError("Upload dokumen mahasiswa (gambar/pdf).");

    setLoading(true);
    try {
      const form = new FormData();
      form.append("link", link);
      form.append("file", file);

      const res = await fetch("/api/verify", { method: "POST", body: form });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Terjadi kesalahan saat memverifikasi.");
      } else {
        setResult(data);
      }
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      background: "linear-gradient(180deg,#050607 0%, #071018 100%)",
      minHeight: "100vh",
      padding: 28,
      color: "#dfffdc"
    }}>
      <div style={{ maxWidth: 920, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
        <section style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
          borderRadius: 12, padding: 22, boxShadow: "0 6px 30px rgba(0,0,0,0.6)",
          border: "1px solid rgba(46,224,122,0.06)"
        }}>
          <h1 style={{ margin: 0, color: "#9ef2b0" }}>Verifikasi Gemini Pro</h1>
          <p style={{ color: "#9aa6a0", marginTop: 8 }}>Tempel link verifikasi SheerID, upload dokumen mahasiswa, lalu klik Verifikasi.</p>

          <form onSubmit={submit} style={{ marginTop: 18 }}>
            <label style={{ display: "block", color: "#9aa6a0", fontSize: 13 }}>Link Verifikasi</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://my.sheerid.com/...verificationId=xxxxx"
              style={{
                width: "100%", padding: 12, marginTop: 8, borderRadius: 8, background: "transparent",
                border: "1px solid rgba(46,224,122,0.12)", color: "#dfffdc"
              }}
            />

            <label style={{ display: "block", color: "#9aa6a0", fontSize: 13, marginTop: 14 }}>Upload Dokumen (jpg/png/pdf)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept="image/*,application/pdf"
              style={{ marginTop: 8, color: "#dfffdc" }}
            />

            {error && <div style={{ marginTop: 12, padding: 10, background: "rgba(255,0,0,0.06)", borderRadius: 8, color: "#ff8a8a" }}>{error}</div>}

            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 16 }}>
              <button type="submit" disabled={loading} style={{
                background: "linear-gradient(90deg,#1ef28a,#13a85e)",
                border: "none", padding: "10px 16px", borderRadius: 10, color: "#02110a", fontWeight: 700
              }}>
                {loading ? "Sedang memverifikasi..." : "Verifikasi"}
              </button>

              <button type="button" onClick={() => { setLink(""); setFile(null); setResult(null); setError(null); }} style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.06)", padding: "8px 12px", borderRadius: 8, color: "#9aa6a0"
              }}>
                Reset
              </button>

              <div style={{ marginLeft: "auto", color: "#6fdc9d", fontSize: 12 }}>Theme: Cyber • Hitam & Hijau</div>
            </div>
          </form>

          <div style={{ marginTop: 18, color: "#8faea0", fontSize: 13 }}>
            <strong>Catatan:</strong> File akan diupload langsung ke SheerID. Pastikan link valid dan file tidak melebihi batas.
          </div>
        </section>

        <aside style={{
          background: "#041018",
          borderRadius: 12,
          padding: 18,
          border: "1px solid rgba(46,224,122,0.06)",
          height: "fit-content"
        }}>
          <h3 style={{ margin: 0, color: "#9ef2b0" }}>Hasil & Log</h3>

          {!result && !loading && <div style={{ marginTop: 12, color: "#9aa6a0" }}>Belum ada hasil. Setelah verifikasi selesai, hasil akan muncul di sini.</div>}

          {loading && <div style={{ marginTop: 12, color: "#bfffcf" }}>Sedang mengirim dokumen ke SheerID... tunggu sebentar.</div>}

          {result && (
            <div style={{ marginTop: 12 }}>
              <div style={{ padding: 12, borderRadius: 8, background: "rgba(0,0,0,0.3)", color: "#dfffdc" }}>
                <div style={{ fontSize: 13, color: "#9aa6a0" }}>Verification ID</div>
                <div style={{ fontWeight: 700, marginTop: 6 }}>{result.verificationId}</div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 13, color: "#9aa6a0" }}>Status</div>
                  <div style={{ marginTop: 6, fontWeight: 700 }}>
                    {result.result?.status || JSON.stringify(result.result?.status) || "Unknown"}
                  </div>
                </div>

                <details style={{ marginTop: 12, color: "#9aa6a0" }}>
                  <summary style={{ cursor: "pointer" }}>Detail respons (raw)</summary>
                  <pre style={{ whiteSpace: "pre-wrap", marginTop: 8, fontSize: 12, color: "#cfeecd" }}>
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}
        </aside>
      </div>

      <footer style={{ textAlign: "center", marginTop: 28, color: "#6aa88a" }}>
        © Verifier • Simple Mode — Gemini Pro
      </footer>
    </main>
  );
}
