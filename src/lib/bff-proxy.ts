import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/src/app/api/auth/[...nextauth]/route';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function proxyToBackend(req: NextRequest, targetPath: string) {
  try {
    const session: any = await getServerSession(authOptions);
    const token = session?.accessToken as string;

    const url = new URL(req.url);
    const search = url.search;
    const backendEndpoint = `${BACKEND_URL}${targetPath.startsWith('/') ? targetPath : '/' + targetPath}${search}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const clientAuth = req.headers.get('authorization');
    if (!token && clientAuth) {
      headers['Authorization'] = clientAuth;
    }

    let body: any = undefined;
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      try {
        body = await req.json();
      } catch {
        // empty body
      }
    }

    const response = await fetch(backendEndpoint, {
      method: req.method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      cache: 'no-store',
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'BFF proxy error' },
      { status: 500 }
    );
  }
}
