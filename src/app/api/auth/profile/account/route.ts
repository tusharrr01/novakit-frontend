import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/src/lib/bff-proxy';

export async function DELETE(req: NextRequest) {
  return proxyToBackend(req, '/auth/account');
}
