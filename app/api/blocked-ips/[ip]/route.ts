import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';

export async function DELETE(request: NextRequest, context: { params: Promise<{ ip: string }> }) {
  try {
    const { ip } = await context.params;
    await dbOperations.unblockIP(decodeURIComponent(ip));
    return NextResponse.json({ message: 'IP unblocked successfully' });
  } catch (error) {
    console.error('Error unblocking IP:', error);
    return NextResponse.json(
      { error: 'Failed to unblock IP' },
      { status: 500 }
    );
  }
}
