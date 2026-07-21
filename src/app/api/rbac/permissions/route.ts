import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/src/lib/bff-proxy';

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/rbac/permissions');
}

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/rbac/permissions');
}
