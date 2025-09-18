import { NextRequest, NextResponse } from 'next/server';
import { storageOperations } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    // Ensure education icons bucket exists
    try {
      await storageOperations.ensureBucketExists('education-icons');
    } catch (bucketError) {
      console.error('Bucket creation/verification failed:', bucketError);
      return NextResponse.json(
        {
          error: 'Storage bucket issue',
          details: bucketError instanceof Error ? bucketError.message : 'Unknown error',
          suggestion: 'Please check your Supabase dashboard and ensure the education-icons bucket exists with proper permissions.'
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;

    console.log('Received upload request:', {
      fileName,
      fileType: file?.type,
      fileSize: file?.size
    });

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type using MIME type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Only JPG, PNG, WebP, and SVG images are allowed.` },
        { status: 400 }
      );
    }

    // Validate file size (2MB for education icons)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 2MB' },
        { status: 400 }
      );
    }

    // Upload to storage
    const url = await storageOperations.uploadEducationIcon(file, fileName || file.name);

    console.log('Upload successful, generated URL:', url);

    // Test if the URL is accessible
    try {
      const testResponse = await fetch(url, { method: 'HEAD' });
      console.log('URL accessibility test:', {
        url,
        status: testResponse.status,
        ok: testResponse.ok,
        contentType: testResponse.headers.get('content-type')
      });
    } catch (testError) {
      console.error('URL accessibility test failed:', testError);
    }

    return NextResponse.json({
      url,
      success: true
    });
  } catch (error) {
    console.error('Error uploading education icon:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload education icon',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}