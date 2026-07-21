import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/src/lib/bff-proxy';

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/users/admin/create');
}
