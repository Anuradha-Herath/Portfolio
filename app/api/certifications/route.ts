import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { storageOperations } from '@/lib/storage';
import { Certification } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    let query = supabaseAdmin
      .from('certifications')
      .select('*')
      .order('date', { ascending: false });

    if (category && (category === 'course' || category === 'competition')) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching certifications:', error);
      return NextResponse.json(
        { error: 'Failed to fetch certifications' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/certifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const issuer = formData.get('issuer') as string;
    const date = formData.get('date') as string;
    const category = formData.get('category') as 'course' | 'competition';
    const credential_id = formData.get('credential_id') as string;
    const url = formData.get('url') as string;
    const description = formData.get('description') as string;
    const certificateFile = formData.get('certificate_file') as File;
    const certificateImage = formData.get('certificate_image') as File;

    // Validate required fields
    if (!title || !issuer || !date || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Handle certificate file upload
    let certificate_file_url: string | undefined;
    if (certificateFile && certificateFile.size > 0) {
      try {
        certificate_file_url = await storageOperations.uploadCertificate(
          certificateFile,
          `${title}-certificate`
        );
      } catch (uploadError) {
        console.error('Error uploading certificate:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload certificate file' },
          { status: 500 }
        );
      }
    }

    // Handle certificate image upload
    let image_url: string | undefined;
    if (certificateImage && certificateImage.size > 0) {
      try {
        image_url = await storageOperations.uploadCertificate(
          certificateImage,
          `${title}-image`
        );
      } catch (uploadError) {
        console.error('Error uploading certificate image:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload certificate image' },
          { status: 500 }
        );
      }
    }

    // Insert into database
    const { data, error } = await supabaseAdmin
      .from('certifications')
      .insert({
        title,
        issuer,
        date,
        category,
        credential_id: credential_id || null,
        url: url || null,
        description: description || null,
        certificate_file_url: certificate_file_url || null,
        image_url: image_url || null,
      })
      .select()
      .single();

    if (error) {
      // If database insert fails and we uploaded files, clean them up
      if (certificate_file_url) {
        await storageOperations.deleteCertificate(certificate_file_url);
      }
      if (image_url) {
        await storageOperations.deleteCertificate(image_url);
      }
      console.error('Error creating certification:', error);
      return NextResponse.json(
        { error: 'Failed to create certification' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST /api/certifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

export const PUT = requireAuth(async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const issuer = formData.get('issuer') as string;
    const date = formData.get('date') as string;
    const category = formData.get('category') as 'course' | 'competition';
    const credential_id = formData.get('credential_id') as string;
    const url = formData.get('url') as string;
    const description = formData.get('description') as string;
    const certificateFile = formData.get('certificate_file') as File;
    const certificateImage = formData.get('certificate_image') as File;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing certification ID' },
        { status: 400 }
      );
    }

    // Get existing certification
    const { data: existingCert, error: fetchError } = await supabaseAdmin
      .from('certifications')
      .select('certificate_file_url, image_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }

    // Handle certificate file upload
    let certificate_file_url = existingCert.certificate_file_url;
    if (certificateFile && certificateFile.size > 0) {
      try {
        // Delete old file if it exists
        if (certificate_file_url) {
          await storageOperations.deleteCertificate(certificate_file_url);
        }
        
        // Upload new file
        certificate_file_url = await storageOperations.uploadCertificate(
          certificateFile,
          `${title}-certificate`
        );
      } catch (uploadError) {
        console.error('Error uploading certificate:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload certificate file' },
          { status: 500 }
        );
      }
    }

    // Handle certificate image upload
    let image_url = existingCert.image_url;
    if (certificateImage && certificateImage.size > 0) {
      try {
        // Delete old image if it exists
        if (image_url) {
          await storageOperations.deleteCertificate(image_url);
        }
        
        // Upload new image
        image_url = await storageOperations.uploadCertificate(
          certificateImage,
          `${title}-image`
        );
      } catch (uploadError) {
        console.error('Error uploading certificate image:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload certificate image' },
          { status: 500 }
        );
      }
    }

    // Update database
    const { data, error } = await supabaseAdmin
      .from('certifications')
      .update({
        title,
        issuer,
        date,
        category,
        credential_id: credential_id || null,
        url: url || null,
        description: description || null,
        certificate_file_url,
        image_url,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating certification:', error);
      return NextResponse.json(
        { error: 'Failed to update certification' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PUT /api/certifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

export const DELETE = requireAuth(async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing certification ID' },
        { status: 400 }
      );
    }

    // Get certification to delete associated files
    const { data: certification, error: fetchError } = await supabaseAdmin
      .from('certifications')
      .select('certificate_file_url, image_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: 'Certification not found' },
        { status: 404 }
      );
    }

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('certifications')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting certification:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete certification' },
        { status: 500 }
      );
    }

    // Delete associated files
    if (certification.certificate_file_url) {
      await storageOperations.deleteCertificate(certification.certificate_file_url);
    }
    if (certification.image_url) {
      await storageOperations.deleteCertificate(certification.image_url);
    }

    return NextResponse.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/certifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});