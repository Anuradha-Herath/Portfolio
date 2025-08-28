# Supabase Setup Guide

## Step 1: Run the Database Schema

Run the `supabase-init.sql` file in your Supabase SQL Editor to create all the necessary tables and triggers.

## Step 2: Create Storage Bucket (Manual Setup)

Since storage bucket creation via SQL has limitations, you need to create the bucket manually:

### Via Supabase Dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Configure the bucket:
   - **Name**: `skill-icons`
   - **Public bucket**: ✅ **Enabled** (important!)
   - **File size limit**: `1 MB` (1048576 bytes)
   - **Allowed MIME types**: `image/svg+xml`
5. Click **"Create bucket"**

### Bucket Policies (Automatic)

The bucket should automatically be created as public, but if you need to set policies manually:

1. Go to **Storage** > **Policies**
2. For the `skill-icons` bucket, ensure there's a policy that allows:
   - **Operation**: SELECT (read)
   - **Policy**: `true` (allow all)

## Step 3: Verify Setup

After creating the bucket, you can test the SVG upload feature:

1. Go to your admin panel (`/admin/skills`)
2. Try adding a new skill with an SVG icon
3. The upload should work and display the icon

## Alternative: Use Code-Based Bucket Creation

If you prefer to create the bucket via code, you can call the storage initialization endpoint:

```bash
POST /api/storage/init
Authorization: Bearer YOUR_ADMIN_TOKEN
```

This will attempt to create the bucket programmatically.

## Troubleshooting

### Common Issues:

1. **Bucket not public**: Make sure the bucket is marked as "Public" in the Supabase dashboard
2. **MIME type restrictions**: Ensure `image/svg+xml` is in the allowed MIME types
3. **File size limit**: Set to at least 1MB to accommodate SVG files
4. **Permissions**: Make sure your service role key has storage permissions

### Error Messages:

- `"Bucket does not exist"`: Create the bucket manually in the dashboard
- `"File upload failed"`: Check bucket permissions and file size limits
- `"Invalid file type"`: Ensure you're uploading SVG files only

## Database Schema Notes

The updated `supabase-init.sql` file now:
- ✅ Creates all necessary tables
- ✅ Sets up triggers and RLS policies  
- ❌ Does NOT create storage bucket (do this manually)
- ✅ Includes sample data for testing

Run the SQL file first, then create the storage bucket manually as described above.
