import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/src/lib/bff-proxy';

/** GET /api/pages/[slug] — public page by slug */
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return proxyToBackend(req, `/pages/${slug}`);
}
