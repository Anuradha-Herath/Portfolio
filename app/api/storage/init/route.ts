import { NextResponse } from 'next/server';
import { storageOperations } from '@/lib/storage';
import { requireAuth } from '@/lib/auth';

export const POST = requireAuth(async () => {
  try {
    await storageOperations.ensureAllBucketsExist();
    return NextResponse.json({ message: 'Storage initialized successfully' });
  } catch (error) {
    console.error('Error initializing storage:', error);
    return NextResponse.json(
      { error: 'Failed to initialize storage' },
      { status: 500 }
    );
  }
});
