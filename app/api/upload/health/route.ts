import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db';

export async function GET() {
  try {
    const startTime = Date.now();

    // Test basic connectivity
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();

    if (listError) {
      return NextResponse.json({
        status: 'error',
        message: 'Storage service unavailable',
        error: listError.message,
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime
      }, { status: 503 });
    }

    // Check if required buckets exist
    const requiredBuckets = ['project-images', 'skill-icons', 'certificates'];
    const existingBuckets = buckets?.map(b => b.name) || [];
    const missingBuckets = requiredBuckets.filter(bucket => !existingBuckets.includes(bucket));

    // Get file counts for existing buckets
    const bucketStats: Record<string, { fileCount?: number; lastModified?: string | null; error?: string }> = {};
    for (const bucketName of existingBuckets) {
      try {
        const { data: files } = await supabaseAdmin.storage.from(bucketName).list();
        bucketStats[bucketName] = {
          fileCount: files?.length || 0,
          lastModified: files?.[0]?.updated_at || null
        };
      } catch (error) {
        bucketStats[bucketName] = { error: error instanceof Error ? error.message : 'Unknown error' };
      }
    }

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: 'healthy',
      message: 'Supabase storage is operational',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      buckets: {
        total: existingBuckets.length,
        existing: existingBuckets,
        missing: missingBuckets,
        stats: bucketStats
      },
      service: {
        provider: 'Supabase',
        region: 'Auto-detected',
        version: 'Latest'
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error during health check',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
