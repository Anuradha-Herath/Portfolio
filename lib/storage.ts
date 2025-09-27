import { supabaseAdmin } from './db';

const SKILL_ICONS_BUCKET = 'skill-icons';
const CERTIFICATES_BUCKET = 'certificates';
const PROJECT_IMAGES_BUCKET = 'project-images';
const EDUCATION_ICONS_BUCKET = 'education-icons';
const PROFILE_IMAGES_BUCKET = 'profile-images';
const CV_FILES_BUCKET = 'cv-files';

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

  async uploadProjectImage(file: File, fileName: string, maxRetries: number = 3): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Upload attempt ${attempt}/${maxRetries} for file: ${fileName}`);

        // Validate file type (images only) - use MIME type for consistency
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          throw new Error(`Invalid file type: ${file.type}. Only JPG, PNG, WebP, and GIF images are allowed`);
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('File size must be less than 5MB');
        }

        // Generate unique filename with proper extension
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueFileName = `${timestamp}-${sanitizedFileName}`;

        console.log('Attempting to upload to bucket:', PROJECT_IMAGES_BUCKET);
        console.log('File details:', { name: uniqueFileName, type: file.type, size: file.size });

        // Upload file to Supabase storage
        const { data, error } = await supabaseAdmin.storage
          .from(PROJECT_IMAGES_BUCKET)
          .upload(uniqueFileName, file, {
            contentType: file.type,
            upsert: false
          });

        if (error) {
          console.error(`Upload attempt ${attempt} failed:`, error);

          // Check if this is a retryable error
          const isRetryable = error.message.includes('network') ||
                             error.message.includes('timeout') ||
                             error.message.includes('fetch') ||
                             error.message.includes('Unexpected token');

          if (!isRetryable || attempt === maxRetries) {
            // Provide more specific error messages
            if (error.message.includes('Bucket not found')) {
              throw new Error(`Storage bucket '${PROJECT_IMAGES_BUCKET}' does not exist. Please create it in your Supabase dashboard.`);
            } else if (error.message.includes('Unauthorized')) {
              throw new Error('Storage upload unauthorized. Please check your Supabase service role key and bucket permissions.');
            } else if (error.message.includes('exceeded')) {
              throw new Error('File size exceeds storage limits. Please try a smaller file.');
            }

            throw new Error(`Upload failed: ${error.message}`);
          }

          // Wait before retrying (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        if (!data?.path) {
          throw new Error('Upload succeeded but no file path returned');
        }

        console.log('Upload successful, file path:', data.path);

        // Get public URL
        const { data: urlData } = supabaseAdmin.storage
          .from(PROJECT_IMAGES_BUCKET)
          .getPublicUrl(data.path);

        if (!urlData.publicUrl) {
          throw new Error('Failed to generate public URL for uploaded file');
        }

        console.log('Public URL generated:', urlData.publicUrl);
        return urlData.publicUrl;

      } catch (error) {
        lastError = error as Error;
        console.error(`Error on attempt ${attempt}:`, error);

        if (attempt === maxRetries) {
          break;
        }

        // Wait before retrying for non-Supabase errors
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // If we get here, all retries failed
    console.error('All upload attempts failed');
    throw lastError || new Error('Upload failed after all retries');
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

  async uploadEducationIcon(file: File, fileName: string): Promise<string> {
    try {
      // Validate file type (images and SVG)
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Only image files (JPG, PNG, WebP, SVG) are allowed');
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      // Upload file to Supabase storage
      const { data, error } = await supabaseAdmin.storage
        .from(EDUCATION_ICONS_BUCKET)
        .upload(uniqueFileName, file, {
          contentType: file.type,
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from(EDUCATION_ICONS_BUCKET)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading education icon:', error);
      throw error;
    }
  },

  async deleteEducationIcon(iconUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(iconUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];

      if (!fileName) {
        throw new Error('Invalid icon URL');
      }

      const { error } = await supabaseAdmin.storage
        .from(EDUCATION_ICONS_BUCKET)
        .remove([fileName]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting education icon:', error);
      // Don't throw error for deletion failures to avoid blocking education deletion
    }
  },

  async uploadProfileImage(file: File, fileName: string): Promise<string> {
    try {
      // Validate file type (images only)
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed');
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
        .from(PROFILE_IMAGES_BUCKET)
        .upload(uniqueFileName, file, {
          contentType: file.type,
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from(PROFILE_IMAGES_BUCKET)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  },

  async deleteProfileImage(imageUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];

      if (!fileName) {
        throw new Error('Invalid image URL');
      }

      const { error } = await supabaseAdmin.storage
        .from(PROFILE_IMAGES_BUCKET)
        .remove([fileName]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting profile image:', error);
      // Don't throw error for deletion failures to avoid blocking hero updates
    }
  },

  async uploadCVFile(file: File, fileName: string): Promise<string> {
    try {
      // Validate file type (PDF or common document types)
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Only PDF and Word documents are allowed');
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Generate unique filename
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}-${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      // Upload file to Supabase storage
      const { data, error } = await supabaseAdmin.storage
        .from(CV_FILES_BUCKET)
        .upload(uniqueFileName, file, {
          contentType: file.type,
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from(CV_FILES_BUCKET)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading CV file:', error);
      throw error;
    }
  },

  async deleteCVFile(fileUrl: string): Promise<void> {
    try {
      // Extract file path from URL
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split('/');
      const fileName = pathParts[pathParts.length - 1];

      if (!fileName) {
        throw new Error('Invalid file URL');
      }

      const { error } = await supabaseAdmin.storage
        .from(CV_FILES_BUCKET)
        .remove([fileName]);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting CV file:', error);
      // Don't throw error for deletion failures to avoid blocking CV management
    }
  },

  async ensureBucketExists(bucketName: string = SKILL_ICONS_BUCKET): Promise<void> {
    try {
      console.log(`Checking if bucket '${bucketName}' exists...`);

      // Check if bucket exists
      const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();

      if (listError) {
        console.error('Error listing buckets:', listError);
        throw new Error(`Failed to list storage buckets: ${listError.message}`);
      }

      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);

      if (!bucketExists) {
        console.log(`Bucket '${bucketName}' does not exist, attempting to create it...`);

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
          : bucketName === EDUCATION_ICONS_BUCKET
          ? {
              public: true,
              allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'],
              fileSizeLimit: 2 * 1024 * 1024 // 2MB limit for education icons
            }
          : bucketName === PROFILE_IMAGES_BUCKET
          ? {
              public: true,
              allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
              fileSizeLimit: 5 * 1024 * 1024 // 5MB limit for profile images
            }
          : bucketName === CV_FILES_BUCKET
          ? {
              public: true,
              allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
              fileSizeLimit: 10 * 1024 * 1024 // 10MB limit for CV files
            }
          : {
              public: true,
              allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
              fileSizeLimit: 5 * 1024 * 1024 // 5MB limit for project images
            };

        const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, bucketConfig);

        if (createError) {
          console.error('Error creating bucket:', createError);
          throw new Error(`Failed to create bucket '${bucketName}': ${createError.message}`);
        }

        console.log(`Successfully created storage bucket: ${bucketName}`);
      } else {
        console.log(`Storage bucket '${bucketName}' already exists`);
      }
    } catch (error) {
      console.error('Error ensuring bucket exists:', error);
      throw error; // Re-throw to let caller handle it
    }
  },

  async ensureAllBucketsExist(): Promise<void> {
    await this.ensureBucketExists(SKILL_ICONS_BUCKET);
    await this.ensureBucketExists(CERTIFICATES_BUCKET);
    await this.ensureBucketExists(PROJECT_IMAGES_BUCKET);
    await this.ensureBucketExists(EDUCATION_ICONS_BUCKET);
    await this.ensureBucketExists(PROFILE_IMAGES_BUCKET);
    await this.ensureBucketExists(CV_FILES_BUCKET);
  }
};
