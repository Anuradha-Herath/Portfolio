import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db';
import { storageOperations } from '@/lib/storage';

export async function GET() {
  try {
    console.log('Testing Supabase storage connection...');

    // Test 1: Check if we can list buckets
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();

    if (listError) {
      console.error('Error listing buckets:', listError);
      return NextResponse.json({
        success: false,
        error: 'Failed to list buckets',
        details: listError.message
      }, { status: 500 });
    }

    console.log('Available buckets:', buckets?.map(b => b.name));

    // Test 2: Check if project-images bucket exists
    const projectImagesBucket = buckets?.find(b => b.name === 'project-images');

    if (!projectImagesBucket) {
      console.log('Project images bucket does not exist, attempting to create...');

      try {
        await storageOperations.ensureBucketExists('project-images');
        return NextResponse.json({
          success: true,
          message: 'Bucket created successfully',
          buckets: buckets?.map(b => b.name)
        });
      } catch (createError) {
        console.error('Failed to create bucket:', createError);
        return NextResponse.json({
          success: false,
          error: 'Failed to create project-images bucket',
          details: createError instanceof Error ? createError.message : 'Unknown error',
          availableBuckets: buckets?.map(b => b.name)
        }, { status: 500 });
      }
    }

    // Test 3: Try to list files in the bucket
    const { data: files, error: filesError } = await supabaseAdmin.storage
      .from('project-images')
      .list();

    if (filesError) {
      console.error('Error listing files:', filesError);
      return NextResponse.json({
        success: false,
        error: 'Can list buckets but cannot access project-images bucket',
        details: filesError.message,
        buckets: buckets?.map(b => b.name)
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase storage is working correctly',
      buckets: buckets?.map(b => b.name),
      projectImagesBucket: {
        name: projectImagesBucket.name,
        created_at: projectImagesBucket.created_at,
        file_count: files?.length || 0
      }
    });

  } catch (error) {
    console.error('Storage test failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Unexpected error during storage test',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
