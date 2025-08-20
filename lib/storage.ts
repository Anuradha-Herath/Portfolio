import { supabaseAdmin } from './db';

const BUCKET_NAME = 'skill-icons';

export const storageOperations = {
  async uploadSkillIcon(file: File, fileName: string): Promise<string> {
    try {
      // Validate file type
      if (!file.type.includes('svg')) {
        throw new Error('Only SVG files are allowed');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      // Upload file to Supabase storage
      const { data, error } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .upload(uniqueFileName, file, {
          contentType: 'image/svg+xml',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading skill icon:', error);
      throw error;
    }
  },

  async deleteSkillIcon(iconUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(iconUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];

      if (!fileName) {
        throw new Error('Invalid icon URL');
      }

      const { error } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .remove([fileName]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting skill icon:', error);
      // Don't throw error for deletion failures to avoid blocking skill deletion
    }
  },

  async ensureBucketExists(): Promise<void> {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
      
      if (listError) {
        throw listError;
      }

      const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);

      if (!bucketExists) {
        // Create bucket with basic configuration
        const { error: createError } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
          public: true,
          allowedMimeTypes: ['image/svg+xml'],
          fileSizeLimit: 1024 * 1024 // 1MB limit
        });

        if (createError) {
          throw createError;
        }

        console.log(`Created storage bucket: ${BUCKET_NAME}`);
      } else {
        console.log(`Storage bucket ${BUCKET_NAME} already exists`);
      }
    } catch (error) {
      console.error('Error ensuring bucket exists:', error);
      // Don't throw error - bucket creation might be restricted
      // The app should still work even if bucket creation fails
      console.warn('Bucket creation failed - you may need to create the bucket manually in Supabase Dashboard');
    }
  }
};
