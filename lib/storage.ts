import { supabaseAdmin } from './db';

const SKILL_ICONS_BUCKET = 'skill-icons';
const CERTIFICATES_BUCKET = 'certificates';

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
        .from(SKILL_ICONS_BUCKET)
        .upload(uniqueFileName, file, {
          contentType: 'image/svg+xml',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from(SKILL_ICONS_BUCKET)
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
        .from(SKILL_ICONS_BUCKET)
        .remove([fileName]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting skill icon:', error);
      // Don't throw error for deletion failures to avoid blocking skill deletion
    }
  },

  async uploadCertificate(file: File, fileName: string): Promise<string> {
    try {
      // Validate file type (PDF or image)
      const validTypes = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (!fileExtension || !validTypes.includes(fileExtension)) {
        throw new Error('Only PDF and image files (JPG, PNG, WebP) are allowed');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      // Upload file to Supabase storage
      const { data, error } = await supabaseAdmin.storage
        .from(CERTIFICATES_BUCKET)
        .upload(uniqueFileName, file, {
          contentType: file.type,
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from(CERTIFICATES_BUCKET)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading certificate:', error);
      throw error;
    }
  },

  async deleteCertificate(certificateUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(certificateUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];

      if (!fileName) {
        throw new Error('Invalid certificate URL');
      }

      const { error } = await supabaseAdmin.storage
        .from(CERTIFICATES_BUCKET)
        .remove([fileName]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting certificate:', error);
      // Don't throw error for deletion failures to avoid blocking certificate deletion
    }
  },

  async ensureBucketExists(bucketName: string = SKILL_ICONS_BUCKET): Promise<void> {
    try {
      // Check if bucket exists
      const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
      
      if (listError) {
        throw listError;
      }

      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);

      if (!bucketExists) {
        // Create bucket with basic configuration
        const bucketConfig = bucketName === SKILL_ICONS_BUCKET 
          ? {
              public: true,
              allowedMimeTypes: ['image/svg+xml'],
              fileSizeLimit: 1024 * 1024 // 1MB limit
            }
          : {
              public: true,
              allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
              fileSizeLimit: 10 * 1024 * 1024 // 10MB limit for certificates
            };

        const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, bucketConfig);

        if (createError) {
          throw createError;
        }

        console.log(`Created storage bucket: ${bucketName}`);
      } else {
        console.log(`Storage bucket ${bucketName} already exists`);
      }
    } catch (error) {
      console.error('Error ensuring bucket exists:', error);
      // Don't throw error - bucket creation might be restricted
      // The app should still work even if bucket creation fails
      console.warn('Bucket creation failed - you may need to create the bucket manually in Supabase Dashboard');
    }
  },

  async ensureAllBucketsExist(): Promise<void> {
    await this.ensureBucketExists(SKILL_ICONS_BUCKET);
    await this.ensureBucketExists(CERTIFICATES_BUCKET);
  }
};
