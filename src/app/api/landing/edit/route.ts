import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/src/lib/bff-proxy';

export async function PUT(req: NextRequest) {
  return proxyToBackend(req, '/landing/edit');
}
