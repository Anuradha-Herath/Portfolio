import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { Experience } from '@/lib/types';

export async function GET() {
  try {
    const experiences = await dbOperations.getExperiences();
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const experienceData: Omit<Experience, 'id'> = await request.json();
    
    // Validate required fields
    if (!experienceData.company || !experienceData.position || !experienceData.start_date) {
      return NextResponse.json(
        { error: 'Company, position, and start date are required' },
        { status: 400 }
      );
    }
    
    const experience = await dbOperations.createExperience(experienceData);
    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
});

export const PUT = requireAuth(async (request: NextRequest) => {
  try {
    const { id, ...updates }: { id: string } & Partial<Omit<Experience, 'id'>> = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Experience ID is required' },
        { status: 400 }
      );
    }
    
    const experience = await dbOperations.updateExperience(id, updates);
    return NextResponse.json(experience);
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    );
  }
});

export const DELETE = requireAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Experience ID is required' },
        { status: 400 }
      );
    }
    
    await dbOperations.deleteExperience(id);
    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    );
  }
});