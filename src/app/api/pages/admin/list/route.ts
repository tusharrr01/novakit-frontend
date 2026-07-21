import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/src/lib/bff-proxy';

/** GET /api/pages/admin/list — admin list of all pages */
export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/pages/admin/list');
}
