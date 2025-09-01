import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    await dbOperations.deleteBlockedIP(id);

    return NextResponse.json({ message: 'Blocked IP removed successfully' });
  } catch (error) {
    console.error('Error deleting blocked IP:', error);
    return NextResponse.json(
      { error: 'Failed to remove blocked IP' },
      { status: 500 }
    );
  }
}
