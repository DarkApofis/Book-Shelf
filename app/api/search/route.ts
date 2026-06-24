/**
 * Book search API — the Open Library proxy, as a same-origin Next route handler.
 * Folded in from the standalone Express BFF so the whole app is one Vercel
 * deploy. Data access (the user's library) still goes straight from the browser
 * to Supabase under RLS and is NOT proxied here.
 */
import { NextResponse } from 'next/server';
import { searchBooks } from '../../../src/server/openLibrary';

// Node runtime (the proxy uses Node fetch + timers); never statically cached.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Open Library can take several seconds; give the function headroom over the
// default 10s so a slow upstream call doesn't get cut off mid-request.
export const maxDuration = 30;

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get('q')?.trim() ?? '';
  if (!q) return NextResponse.json({ results: [] });

  try {
    const results = await searchBooks(q);
    return NextResponse.json({ results });
  } catch (err) {
    console.error('[api/search] failed:', err);
    return NextResponse.json(
      { error: 'Book search is temporarily unavailable. Please try again.' },
      { status: 502 },
    );
  }
}
