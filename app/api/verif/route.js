// app/api/verify/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const form = await req.formData();
    const link = (form.get("link") || "").toString();
    const file = form.get("file");

    if (!link || !file) {
      return NextResponse.json({ error: "Masukkan link & upload dokumen" }, { status: 400 });
    }

    // extract verificationId
    const match = link.match(/verificationId=([A-Za-z0-9_-]+)/);
    if (!match) {
      return NextResponse.json({ error: "verificationId tidak ditemukan" }, { status: 400 });
    }
    const vid = match[1];

    // file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // 1) request upload URL (public endpoint)
    const docRes = await axios.post(
      `https://my.sheerid.com/rest/v2/verification/${vid}/document`,
      {},
      { headers: { "Content-Type": "application/json" }, timeout: 20000 }
    );

    const uploadUrl = docRes.data?.uploadUrl;
    if (!uploadUrl) return NextResponse.json({ error: "Upload URL tidak ditemukan" }, { status: 500 });

    // 2) upload file (PUT)
    await axios.put(uploadUrl, fileBuffer, {
      headers: { "Content-Type": file.type || "image/png" },
      timeout: 30000,
    });

    // 3) submit verification
    await axios.post(
      `https://my.sheerid.com/rest/v2/verification/${vid}/submit`,
      {},
      { headers: { "Content-Type": "application/json" }, timeout: 20000 }
    );

    // 4) get final status
    const status = await axios.get(`https://my.sheerid.com/rest/v2/verification/${vid}`, { timeout: 15000 });

    return NextResponse.json({ verificationId: vid, result: status.data });
  } catch (err) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
        }
