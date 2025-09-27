import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '@/lib/auth';
import { storageOperations } from '@/lib/storage';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const GET = async () => {
  try {
    const { data, error } = await supabase
      .from('hero')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching hero data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch hero data' },
        { status: 500 }
      );
    }

    // Add caching headers for better performance
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // Cache for 5 minutes, serve stale for 10 minutes
      },
    });
  } catch (error) {
    console.error('Error in hero GET route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

export const PUT = requireAuth(async (request: NextRequest) => {
  try {
    const heroData = await request.json();

    // Validate required fields
    if (!heroData.name || !heroData.title || !heroData.subtitle || !heroData.description) {
      return NextResponse.json(
        { error: 'Name, title, subtitle, and description are required' },
        { status: 400 }
      );
    }

    // Get current hero data to handle image replacement
    const { data: currentHero } = await supabase
      .from('hero')
      .select('profile_image_url')
      .single();

    // If there's a new profile image and an old one exists, delete the old one
    if (heroData.profile_image_url && currentHero?.profile_image_url &&
        heroData.profile_image_url !== currentHero.profile_image_url) {
      try {
        await storageOperations.deleteProfileImage(currentHero.profile_image_url);
      } catch (deleteError) {
        console.warn('Failed to delete old profile image:', deleteError);
        // Don't fail the update if image deletion fails
      }
    }

    // Update or insert hero data
    const { data, error } = await supabase
      .from('hero')
      .upsert(heroData, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Error updating hero data:', error);
      return NextResponse.json(
        { error: 'Failed to update hero data' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in hero PUT route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});