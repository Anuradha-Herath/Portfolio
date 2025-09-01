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

    // Basic validation
    if (!ip) {
      return NextResponse.json(
        { error: 'IP address is required' },
        { status: 400 }
      );
    }

    // Basic IP validation
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ip)) {
      return NextResponse.json(
        { error: 'Invalid IP address format' },
        { status: 400 }
      );
    }

    // Check if IP is already blocked
    const isAlreadyBlocked = await dbOperations.isIPBlocked(ip);
    if (isAlreadyBlocked) {
      return NextResponse.json(
        { error: 'IP address is already blocked' },
        { status: 400 }
      );
    }

    const blockedIP = await dbOperations.createBlockedIP({
      ip,
      reason: reason || 'Blocked by admin',
      blocked_by: 'admin'
    });

    return NextResponse.json(
      {
        message: 'IP address blocked successfully',
        blockedIP
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blocked IP:', error);
    return NextResponse.json(
      { error: 'Failed to block IP address' },
      { status: 500 }
    );
  }
}
