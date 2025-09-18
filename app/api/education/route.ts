import { NextRequest } from 'next/server';
import { dbOperations } from '@/lib/db';
import { Education } from '@/lib/types';

export async function GET() {
  try {
    const education = await dbOperations.getEducation();
    console.log('Retrieved education data:', education.map(e => ({
      id: e.id,
      institution: e.institution,
      hasIcon: !!e.icon_url,
      iconUrl: e.icon_url
    })));
    return Response.json(education);
  } catch (error) {
    console.error('Error fetching education:', error);
    return Response.json(
      { error: 'Failed to fetch education' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newEducation = await dbOperations.createEducation(body);
    return Response.json(newEducation, { status: 201 });
  } catch (error) {
    console.error('Error creating education:', error);
    return Response.json(
      { error: 'Failed to create education' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return Response.json(
        { error: 'Education ID is required' },
        { status: 400 }
      );
    }

    const updatedEducation = await dbOperations.updateEducation(id, updates);
    return Response.json(updatedEducation);
  } catch (error) {
    console.error('Error updating education:', error);
    return Response.json(
      { error: 'Failed to update education' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return Response.json(
        { error: 'Education ID is required' },
        { status: 400 }
      );
    }

    await dbOperations.deleteEducation(id);
    return Response.json({ message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Error deleting education:', error);
    return Response.json(
      { error: 'Failed to delete education' },
      { status: 500 }
    );
  }
}