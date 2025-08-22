# Storage Bucket Creation Guide

## Method 1: Supabase Dashboard (Recommended)

### Step-by-Step Instructions:

1. **Go to your Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Navigate to Storage**
   - Click on "Storage" in the left sidebar
   - Click on "Buckets" tab

3. **Create the 'skill-icons' bucket** (if it doesn't exist)
   - Click "New bucket"
   - **Bucket name**: `skill-icons`
   - **Public bucket**: ✅ Yes (checked)
   - **File size limit**: `1048576` (1MB in bytes)
   - **Allowed MIME types**: Add these one by one:
     - `image/svg+xml`
   - Click "Save"

4. **Create the 'certificates' bucket**
   - Click "New bucket" again
   - **Bucket name**: `certificates`
   - **Public bucket**: ✅ Yes (checked)
   - **File size limit**: `10485760` (10MB in bytes)
   - **Allowed MIME types**: Add these one by one:
     - `application/pdf`
     - `image/jpeg`
     - `image/jpg`
     - `image/png`
     - `image/webp`
   - Click "Save"

### Expected Result:
You should see two buckets in your Storage dashboard:
- ✅ `skill-icons` (1MB limit, SVG only)
- ✅ `certificates` (10MB limit, PDF and images)

---

## Method 2: Using the Admin Interface

1. **Start your development server** (if not running):
   ```bash
   npm run dev
   ```

2. **Navigate to admin panel**:
   - Go to `http://localhost:3001/admin`
   - Log in as admin

3. **Initialize storage** (if the endpoint works):
   - Use browser developer tools
   - Go to Console tab
   - Run this JavaScript:
   ```javascript
   fetch('/api/storage/init', { method: 'POST' })
     .then(res => res.json())
     .then(data => console.log(data))
     .catch(err => console.error(err));
   ```

---

## Method 3: SQL Script (Alternative)

If the above methods don't work, you can also create buckets using SQL in Supabase SQL Editor:

```sql
-- Create skill-icons bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'skill-icons',
  'skill-icons',
  true,
  1048576,
  ARRAY['image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Create certificates bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'certificates',
  'certificates',
  true,
  10485760,
  ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;
```

---

## Verification

After creating the buckets, you can verify them by:

1. **In Supabase Dashboard**: Check Storage > Buckets
2. **In your app**: Visit the certifications admin page and try uploading a file
3. **Via API**: Test the upload functionality

---

## Troubleshooting

### Common Issues:
- **Permission errors**: Make sure you have admin access to your Supabase project
- **MIME type errors**: Ensure you've added all the specified MIME types exactly as shown
- **Size limit errors**: Verify the file size limits are set correctly (1MB for icons, 10MB for certificates)

### If buckets already exist:
- You can update existing buckets by editing them in the Supabase Dashboard
- Or delete and recreate them if needed

---

**Recommended**: Use Method 1 (Supabase Dashboard) as it's the most reliable and user-friendly approach.
