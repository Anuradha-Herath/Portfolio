import { supabaseAdmin } from './db';

const SKILL_ICONS_BUCKET = 'skill-icons';
const CERTIFICATES_BUCKET = 'certificates';
const PROJECT_IMAGES_BUCKET = 'project-images';

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

  async uploadProjectImage(file: File, fileName: string): Promise<string> {
    try {
      // Validate file type (images only)
      const validTypes = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (!fileExtension || !validTypes.includes(fileExtension)) {
        throw new Error('Only image files (JPG, PNG, WebP, GIF) are allowed');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      // Upload file to Supabase storage
      const { data, error } = await supabaseAdmin.storage
        .from(PROJECT_IMAGES_BUCKET)
        .upload(uniqueFileName, file, {
          contentType: file.type,
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from(PROJECT_IMAGES_BUCKET)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading project image:', error);
      throw error;
    }
  },

  async deleteProjectImage(imageUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];

      if (!fileName) {
        throw new Error('Invalid image URL');
      }

      const { error } = await supabaseAdmin.storage
        .from(PROJECT_IMAGES_BUCKET)
        .remove([fileName]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting project image:', error);
      // Don't throw error for deletion failures to avoid blocking project deletion
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
          : bucketName === CERTIFICATES_BUCKET
          ? {
              public: true,
              allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
              fileSizeLimit: 10 * 1024 * 1024 // 10MB limit for certificates
            }
          : {
              public: true,
              allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
              fileSizeLimit: 5 * 1024 * 1024 // 5MB limit for project images
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
    await this.ensureBucketExists(PROJECT_IMAGES_BUCKET);
  }
};
