import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/src/lib/bff-proxy';

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/announcements');
}

export async function PUT(req: NextRequest) {
  return proxyToBackend(req, '/announcements');
}

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/announcements');
}
