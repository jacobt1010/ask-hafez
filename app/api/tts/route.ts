import { NextRequest, NextResponse } from "next/server";
import { getPoemById } from "@/lib/poems";

const audioCache = new Map<string, Buffer>();

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const poem = getPoemById(id);
  if (!poem) {
    return NextResponse.json({ error: "Unknown poem id" }, { status: 400 });
  }

  const { tts_text_fa, cache_key } = poem.audio;

  const cached = audioCache.get(cache_key);
  if (cached) {
    return new NextResponse(new Uint8Array(cached), {
      status: 200,
      headers: { "Content-Type": "audio/mpeg" },
    });
  }

  const apiKey = process.env.AZURE_TTS_KEY;
  const region = process.env.AZURE_TTS_REGION;
  const voice = process.env.AZURE_TTS_VOICE || "fa-IR-DilaraNeural";

  if (!apiKey || !region) {
    return NextResponse.json({ error: "TTS is not configured" }, { status: 503 });
  }

  const ssml = `<speak version="1.0" xml:lang="fa-IR"><voice xml:lang="fa-IR" name="${voice}">${escapeXml(
    tts_text_fa
  )}</voice></speak>`;

  try {
    const azureRes = await fetch(
      `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
        },
        body: ssml,
      }
    );

    if (!azureRes.ok) {
      return NextResponse.json({ error: "Azure TTS request failed" }, { status: 502 });
    }

    const arrayBuffer = await azureRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    audioCache.set(cache_key, buffer);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch {
    return NextResponse.json({ error: "Azure TTS request failed" }, { status: 502 });
  }
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
