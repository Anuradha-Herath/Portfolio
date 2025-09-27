import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { storageOperations } from '@/lib/storage';

export const POST = requireAuth(async (request: NextRequest) => {
  try {
    // Ensure the profile images bucket exists
    console.log('Ensuring profile-images bucket exists...');
    await storageOperations.ensureBucketExists('profile-images');
    console.log('Bucket check/creation completed');

    const formData = await request.formData();
    const file = formData.get('file') as File;

    console.log('File received:', { name: file.name, type: file.type, size: file.size });

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    const fileName = file.name || 'profile-image';
    const imageUrl = await storageOperations.uploadProfileImage(file, fileName);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
});