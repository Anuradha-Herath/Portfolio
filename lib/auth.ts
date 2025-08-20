import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AdminUser {
  username: string;
  isAdmin: boolean;
}

export function verifyCredentials(username: string, password: string): boolean {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  return username === adminUsername && password === adminPassword;
}

export function generateToken(user: AdminUser): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  
  return jwt.sign(user, secret, { expiresIn: '24h' });
}

export function verifyToken(token: string): AdminUser | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    const decoded = jwt.verify(token, secret) as AdminUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Also check cookies
  const tokenCookie = request.cookies.get('admin-token');
  return tokenCookie?.value || null;
}

export function isAuthenticated(request: NextRequest): boolean {
  const token = getTokenFromRequest(request);
  if (!token) return false;
  
  const user = verifyToken(token);
  return user?.isAdmin === true;
}

export function requireAuth(handler: (request: NextRequest) => Promise<Response>) {
  return async (request: NextRequest) => {
    if (!isAuthenticated(request)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return handler(request);
  };
}