import { NextResponse } from "next/server";
import axios from "axios";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const form = await req.formData();
    const link = form.get("link");
    const file = form.get("file");

    if (!link || !file) {
      return NextResponse.json({ error: "Link & file wajib diisi" }, { status: 400 });
    }

    const match = link.match(/verificationId=([A-Za-z0-9_-]+)/);
    if (!match) {
      return NextResponse.json({ error: "verificationId tidak ditemukan" }, { status: 400 });
    }

    const vid = match[1];

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1) MINTA URL UPLOAD
    const doc = await axios.post(
      `https://my.sheerid.com/rest/v2/verification/${vid}/document`,
      {},
      { headers: { "Content-Type": "application/json" } }
    );

    if (!doc.data?.uploadUrl) {
      return NextResponse.json({ error: "Upload URL tidak ditemukan" }, { status: 500 });
    }

    const uploadUrl = doc.data.uploadUrl;

    // 2) UPLOAD DOKUMEN
    await axios.put(uploadUrl, buffer, {
      headers: { "Content-Type": file.type || "application/octet-stream" },
    });

    // 3) SUBMIT VERIFIKASI
    await axios.post(
      `https://my.sheerid.com/rest/v2/verification/${vid}/submit`,
      {},
      { headers: { "Content-Type": "application/json" } }
    );

    // 4) CEK STATUS
    const status = await axios.get(
      `https://my.sheerid.com/rest/v2/verification/${vid}`
    );

    return NextResponse.json({
      verificationId: vid,
      result: status.data,
    });

  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Gagal memproses" },
      { status: 500 }
    );
  }
      }
