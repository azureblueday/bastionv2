import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

export function apiResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}

export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function requireAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyToken(token);
}

export function requireAdmin(request: NextRequest) {
  const user = requireAuth(request);
  
  if (!user || !user.isAdmin) {
    return null;
  }

  return user;
}
