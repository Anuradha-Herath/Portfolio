import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db';

export async function GET() {
  try {
    // Check if education-icons bucket exists and is accessible
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();

    if (listError) {
      return NextResponse.json(
        { error: 'Failed to list buckets', details: listError.message },
        { status: 500 }
      );
    }

    const educationBucket = buckets?.find(bucket => bucket.name === 'education-icons');

    if (!educationBucket) {
      return NextResponse.json(
        { error: 'education-icons bucket does not exist' },
        { status: 404 }
      );
    }

    // List files in the bucket
    const { data: files, error: filesError } = await supabaseAdmin.storage
      .from('education-icons')
      .list();

    if (filesError) {
      return NextResponse.json(
        { error: 'Failed to list files', details: filesError.message },
        { status: 500 }
      );
    }

    // Test public URL for first file if exists
    let testUrl = null;
    let urlAccessible = false;

    if (files && files.length > 0) {
      const { data: urlData } = supabaseAdmin.storage
        .from('education-icons')
        .getPublicUrl(files[0].name);

      testUrl = urlData.publicUrl;

      try {
        const response = await fetch(testUrl, { method: 'HEAD' });
        urlAccessible = response.ok;
      } catch (error) {
        console.error('URL test failed:', error);
      }
    }

    return NextResponse.json({
      bucket: educationBucket,
      fileCount: files?.length || 0,
      testUrl,
      urlAccessible,
      files: files?.slice(0, 5) // Show first 5 files
    });
  } catch (error) {
    console.error('Error checking bucket:', error);
    return NextResponse.json(
      { error: 'Failed to check bucket', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}