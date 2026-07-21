import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/src/lib/bff-proxy';

/** GET /api/pages/admin/[id] — get single page by ID for edit form */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyToBackend(req, `/pages/admin/${id}`);
}
