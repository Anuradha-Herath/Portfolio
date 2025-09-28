import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db';

// GET /api/cv/active - Get the active CV file (public endpoint)
export const GET = async (request: NextRequest) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('cv_files')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No active CV found, return null to indicate no CV is available
        return NextResponse.json({
          file_url: null,
          name: 'No CV Available'
        });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching active CV:', error);
    // Return null on any error to indicate no CV is available
    return NextResponse.json({
      file_url: null,
      name: 'No CV Available'
    });
  }
};