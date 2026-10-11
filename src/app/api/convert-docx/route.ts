import { NextResponse } from 'next/server';
import mammoth from 'mammoth';

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const targetUrl = body?.url;

    if (!targetUrl || typeof targetUrl !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid "url" in request body' }, { status: 400 });
    }

    // Security check: validate protocol
    const parsed = new URL(targetUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return NextResponse.json({ error: 'Invalid URL protocol' }, { status: 400 });
    }

    const response = await fetch(targetUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch document from source (${response.status}: ${response.statusText})` },
        { status: response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert Word document to HTML
    const result = await mammoth.convertToHtml({ buffer });

    return NextResponse.json({
      html: result.value,
      messages: result.messages,
    });
  } catch (err: any) {
    console.error('convert-docx error:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal Server Error while converting DOCX' },
      { status: 500 }
    );
  }
}
