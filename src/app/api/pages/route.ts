import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/src/lib/bff-proxy';

/** GET /api/pages — list all active pages (public) */
export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/pages');
}
