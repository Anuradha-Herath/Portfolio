import { NextRequest, NextResponse } from 'next/server';
import { dbOperations } from '@/lib/db';
import { storageOperations } from '@/lib/storage';
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
    // Ensure storage bucket exists
    await storageOperations.ensureBucketExists();
    
    const formData = await request.formData();
    const skillDataStr = formData.get('skillData') as string;
    const iconFile = formData.get('iconFile') as File | null;
    
    if (!skillDataStr) {
      return NextResponse.json(
        { error: 'Skill data is required' },
        { status: 400 }
      );
    }
    
    const skillData: Omit<Skill, 'id'> = JSON.parse(skillDataStr);
    
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
    
    // Handle icon upload if provided
    let iconUrl = skillData.icon || '';
    if (iconFile && iconFile.size > 0) {
      try {
        iconUrl = await storageOperations.uploadSkillIcon(iconFile, `${skillData.name.toLowerCase().replace(/\s+/g, '-')}.svg`);
      } catch (uploadError) {
        console.error('Icon upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload icon' },
          { status: 500 }
        );
      }
    }
    
    const skill = await dbOperations.createSkill({
      ...skillData,
      icon: iconUrl
    });
    
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
    // Ensure storage bucket exists
    await storageOperations.ensureBucketExists();
    
    const formData = await request.formData();
    const skillDataStr = formData.get('skillData') as string;
    const iconFile = formData.get('iconFile') as File | null;
    
    if (!skillDataStr) {
      return NextResponse.json(
        { error: 'Skill data is required' },
        { status: 400 }
      );
    }
    
    const { id, ...updates }: { id: string } & Partial<Omit<Skill, 'id'>> = JSON.parse(skillDataStr);
    
    if (!id) {
      return NextResponse.json(
        { error: 'Skill ID is required' },
        { status: 400 }
      );
    }
    
    // Get current skill to check for existing icon
    const currentSkills = await dbOperations.getSkills();
    const currentSkill = currentSkills.find(skill => skill.id === id);
    
    // Handle icon upload if provided
    let iconUrl = updates.icon || '';
    if (iconFile && iconFile.size > 0) {
      try {
        // Delete old icon if it exists and is from our storage
        if (currentSkill?.icon && currentSkill.icon.includes('supabase')) {
          await storageOperations.deleteSkillIcon(currentSkill.icon);
        }
        
        // Upload new icon
        iconUrl = await storageOperations.uploadSkillIcon(
          iconFile, 
          `${(updates.name || currentSkill?.name || 'skill').toLowerCase().replace(/\s+/g, '-')}.svg`
        );
      } catch (uploadError) {
        console.error('Icon upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload icon' },
          { status: 500 }
        );
      }
    } else if (updates.icon === '') {
      // If explicitly clearing the icon, delete the old one
      if (currentSkill?.icon && currentSkill.icon.includes('supabase')) {
        await storageOperations.deleteSkillIcon(currentSkill.icon);
      }
    }
    
    const skill = await dbOperations.updateSkill(id, {
      ...updates,
      icon: iconUrl
    });
    
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
    
    // Get skill to check for icon before deletion
    const skills = await dbOperations.getSkills();
    const skill = skills.find(s => s.id === id);
    
    // Delete associated icon if it exists
    if (skill?.icon && skill.icon.includes('supabase')) {
      await storageOperations.deleteSkillIcon(skill.icon);
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