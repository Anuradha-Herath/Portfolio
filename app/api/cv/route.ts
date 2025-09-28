import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/db';
import { storageOperations } from '@/lib/storage';

// GET /api/cv - Get all CV files (public access)
export const GET = async (request: NextRequest) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('cv_files')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching CV files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CV files' },
      { status: 500 }
    );
  }
};

// POST /api/cv - Upload a new CV file
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    // Ensure the CV files bucket exists
    console.log('Ensuring cv-files bucket exists...');
    await storageOperations.ensureBucketExists('cv-files');
    console.log('Bucket check/creation completed');

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      );
    }

    const fileName = file.name || 'cv-file';
    const fileUrl = await storageOperations.uploadCVFile(file, fileName);

    // Save file info to database
    const { data, error } = await supabaseAdmin
      .from('cv_files')
      .insert({
        name,
        file_url: fileUrl,
        file_size: file.size,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading CV file:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload CV file' },
      { status: 500 }
    );
  }
});