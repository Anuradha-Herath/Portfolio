import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';

export async function GET() {
  try {
    const blockedIPs = await dbOperations.getBlockedIPs();
    return NextResponse.json(blockedIPs);
  } catch (error) {
    console.error('Error fetching blocked IPs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blocked IPs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ip, reason } = body;

    if (!ip) {
      return NextResponse.json(
        { error: 'IP address is required' },
        { status: 400 }
      );
    }

    const blockedIP = await dbOperations.blockIP(ip, reason);
    return NextResponse.json(blockedIP, { status: 201 });
  } catch (error) {
    console.error('Error blocking IP:', error);
    return NextResponse.json(
      { error: 'Failed to block IP' },
      { status: 500 }
    );
  }
}
