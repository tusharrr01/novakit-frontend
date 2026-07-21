import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/src/lib/bff-proxy';

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/settings');
}

export async function PUT(req: NextRequest) {
  return proxyToBackend(req, '/settings');
}
