import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'URL parameter required' }, { status: 400 });
    }

    // Fetch the image from Instagram
    const res = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: res.status });
    }

    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': res.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (err) {
    console.error('Image proxy error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
