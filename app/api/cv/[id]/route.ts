import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/db';
import { storageOperations } from '@/lib/storage';

// GET /api/cv/[id] - Get a specific CV file
export const GET = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { data, error } = await supabaseAdmin
      .from('cv_files')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'CV file not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching CV file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CV file' },
      { status: 500 }
    );
  }
};

// PUT /api/cv/[id] - Update a CV file (set as active/inactive)
export const PUT = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, is_active } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (is_active !== undefined) updateData.is_active = is_active;

    // If setting as active, deactivate all other CV files
    if (is_active === true) {
      await supabaseAdmin
        .from('cv_files')
        .update({ is_active: false })
        .neq('id', id);
    }

    const { data, error } = await supabaseAdmin
      .from('cv_files')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'CV file not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating CV file:', error);
    return NextResponse.json(
      { error: 'Failed to update CV file' },
      { status: 500 }
    );
  }
};

// DELETE /api/cv/[id] - Delete a CV file
export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    // First get the file URL to delete from storage
    const { data: cvFile, error: fetchError } = await supabaseAdmin
      .from('cv_files')
      .select('file_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'CV file not found' },
          { status: 404 }
        );
      }
      throw fetchError;
    }

    // Delete from storage
    if (cvFile.file_url && !cvFile.file_url.startsWith('/')) {
      await storageOperations.deleteCVFile(cvFile.file_url);
    }

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('cv_files')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ message: 'CV file deleted successfully' });
  } catch (error) {
    console.error('Error deleting CV file:', error);
    return NextResponse.json(
      { error: 'Failed to delete CV file' },
      { status: 500 }
    );
  }
};