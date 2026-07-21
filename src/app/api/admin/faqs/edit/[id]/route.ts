import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/src/lib/bff-proxy';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyToBackend(req, `/admin/faqs/edit/${id}`);
}
