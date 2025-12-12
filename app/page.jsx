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
    if (!file) return setError("Upload dokumen mahasiswa.");

    setLoading(true);
    try {
      const form = new FormData();
      form.append("link", link);
      form.append("file", file);

      const res = await fetch("/api/verify", { method: "POST", body: form });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { status: res.status, ok: res.ok };
      }

      if (!res.ok) {
        setError(data?.error || "Gagal memverifikasi.");
      } else {
        setResult(data);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      background:"#030b0a",
      minHeight:"100vh",
      padding:30,
      fontFamily:"Inter",
      color:"#d9ffe5"
    }}>

      <div style={{
        maxWidth:900,
        margin:"0 auto",
        display:"grid",
        gridTemplateColumns:"1fr 350px",
        gap:25
      }}>

        {/* FORM */}
        <section style={{
          background:"rgba(0,0,0,0.4)",
          border:"1px solid #0f442c",
          padding:20,
          borderRadius:12,
          boxShadow:"0 0 15px #0a2518"
        }}>

          <h1 style={{color:"#38f59e", margin:0}}>Verifikasi Gemini Pro</h1>
          <p style={{color:"#7ba891", marginTop:6}}>
            Masukkan link verifikasi SheerID & upload dokumen.
          </p>

          <form onSubmit={submit} style={{marginTop:20}}>
            <label>Link SheerID</label>
            <input 
              value={link}
              onChange={(e)=>setLink(e.target.value)}
              placeholder="https://my.sheerid.com/...verificationId=xxxx"
              style={{
                width:"100%", padding:12, marginTop:6,
                background:"transparent",
                border:"1px solid #0f442c",
                borderRadius:8,
                color:"#d9ffe5"
              }}
            />

            <label style={{marginTop:14, display:"block"}}>Upload Dokumen</label>
            <input 
              type="file"
              accept="image/*,application/pdf"
              onChange={(e)=>setFile(e.target.files[0])}
              style={{marginTop:6}}
            />

            {error && (
              <div style={{
                marginTop:12,
                padding:10,
                borderRadius:8,
                background:"rgba(255,0,0,0.1)",
                color:"#ff7a7a"
              }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              marginTop:20,
              background:"#1ef28a",
              color:"#042315",
              fontWeight:700,
              padding:"10px 16px",
              borderRadius:10,
              border:"none"
            }}>
              {loading ? "Memproses..." : "Verifikasi"}
            </button>
          </form>
        </section>

        {/* HASIL */}
        <aside style={{
          background:"rgba(0,0,0,0.35)",
          border:"1px solid #0f442c",
          borderRadius:12,
          padding:20
        }}>
          <h3 style={{color:"#38f59e", margin:0}}>Hasil</h3>

          {!loading && !result && (
            <p style={{color:"#7ba891", marginTop:10}}>
              Belum ada hasil.
            </p>
          )}

          {loading && (
            <p style={{color:"#bfffda", marginTop:10}}>
              Mengirim dokumen ke SheerID...
            </p>
          )}

          {result && (
            <div style={{marginTop:15}}>
              <div style={{
                padding:14,
                background:"rgba(0,0,0,0.25)",
                borderRadius:8
              }}>
                <div>Verification ID:</div>
                <b>{result.verificationId}</b>

                <div style={{marginTop:12}}>Status:</div>
                <b>{result.result?.status}</b>

                <details style={{marginTop:12}}>
                  <summary style={{cursor:"pointer"}}>Lihat Raw Data</summary>
                  <pre style={{whiteSpace:"pre-wrap", fontSize:12}}>
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          )}
        </aside>

      </div>
    </main>
  );
            }
