import { NextRequest, NextResponse } from 'next/server';
import { storageOperations } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    // Ensure project images bucket exists
    try {
      await storageOperations.ensureBucketExists('project-images');
    } catch (bucketError) {
      console.error('Bucket creation/verification failed:', bucketError);
      return NextResponse.json(
        {
          error: 'Storage bucket issue',
          details: bucketError instanceof Error ? bucketError.message : 'Unknown error',
          suggestion: 'Please check your Supabase dashboard and ensure the project-images bucket exists with proper permissions.'
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const fileNames = formData.getAll('fileNames') as string[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    // Process files with improved concurrency
    const BATCH_SIZE = 5; // Increased from 2 to 5
    const CONCURRENT_BATCHES = 3; // Process 3 batches simultaneously

    // Create batches
    const batches = [];
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      batches.push({
        files: files.slice(i, i + BATCH_SIZE),
        names: fileNames.slice(i, i + BATCH_SIZE)
      });
    }

    // Process batches with controlled concurrency
    for (let i = 0; i < batches.length; i += CONCURRENT_BATCHES) {
      const concurrentBatches = batches.slice(i, i + CONCURRENT_BATCHES);

      const batchPromises = concurrentBatches.map(async (batch) => {
        const batchResults = await Promise.allSettled(
          batch.files.map(async (file, index) => {
            const fileName = batch.names[index] || file.name;

            // Validate file type using MIME type (consistent with storage function)
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
            if (!validTypes.includes(file.type)) {
              throw new Error(`Invalid file type for ${fileName}: ${file.type}. Only JPG, PNG, WebP, and GIF images are allowed.`);
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
              throw new Error(`File ${fileName} size must be less than 5MB`);
            }

            // Upload to storage
            const url = await storageOperations.uploadProjectImage(file, fileName);
            return { fileName, url };
          })
        );

        return batchResults;
      });

      try {
        const concurrentResults = await Promise.allSettled(batchPromises);

        for (const batchResult of concurrentResults) {
          if (batchResult.status === 'fulfilled') {
            for (const result of batchResult.value) {
              if (result.status === 'fulfilled') {
                results.push(result.value);
              } else {
                console.error('Individual upload failed:', result.reason);
                errors.push(result.reason.message || 'Unknown upload error');
              }
            }
          } else {
            console.error('Batch processing error:', batchResult.reason);
            errors.push(`Batch processing error: ${batchResult.reason}`);
          }
        }
      } catch (error) {
        console.error('Concurrent batch processing error:', error);
        errors.push(`Concurrent batch processing error: ${error}`);
      }

      // Minimal delay between concurrent batch groups (reduced from 500ms)
      if (i + CONCURRENT_BATCHES < batches.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return NextResponse.json({
      urls: results.map(r => r.url),
      results,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error in batch upload:', error);
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}
