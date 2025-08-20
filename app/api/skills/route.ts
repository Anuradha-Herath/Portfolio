import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { Skill } from '@/lib/types';

export async function GET() {
  try {
    const skills = await dbOperations.getSkills();
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const skillData: Omit<Skill, 'id'> = await request.json();
    
    // Validate required fields
    if (!skillData.name || !skillData.category || !skillData.level) {
      return NextResponse.json(
        { error: 'Name, category, and level are required' },
        { status: 400 }
      );
    }
    
    // Validate level
    const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    if (!validLevels.includes(skillData.level)) {
      return NextResponse.json(
        { error: 'Invalid skill level' },
        { status: 400 }
      );
    }
    
    const skill = await dbOperations.createSkill(skillData);
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
});

export const PUT = requireAuth(async (request: NextRequest) => {
  try {
    const { id, ...updates }: { id: string } & Partial<Omit<Skill, 'id'>> = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Skill ID is required' },
        { status: 400 }
      );
    }
    
    const skill = await dbOperations.updateSkill(id, updates);
    return NextResponse.json(skill);
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json(
      { error: 'Failed to update skill' },
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
        { error: 'Skill ID is required' },
        { status: 400 }
      );
    }
    
    await dbOperations.deleteSkill(id);
    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
});