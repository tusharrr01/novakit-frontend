import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/src/lib/bff-proxy';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyToBackend(req, `/admin/services/delete/${id}`);
}
