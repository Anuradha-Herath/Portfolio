# Certificate Image Feature Implementation

## Overview
Added a separate image upload field for certificate images in the certification management system. This allows users to upload visual representations of their certificates that will be displayed prominently in the portfolio section.

## Changes Made

### 1. Database Schema
- The `image_url` field already existed in the `certifications` table
- Created migration script (`supabase-image-migration.sql`) to ensure the column exists

### 2. Form Component (`CertificationForm.tsx`)
- Added `certificateImage` state for managing image file uploads
- Added `handleImageChange` function for image file validation
- Added separate image upload field in the form
- Image validation: only JPG, PNG, WebP files up to 5MB
- Shows preview of current image when editing
- Displays selected file information

### 3. API Route (`/api/certifications/route.ts`)
- Updated POST method to handle `certificate_image` form data
- Updated PUT method to handle image updates and cleanup
- Updated DELETE method to remove associated image files
- Added proper error handling for image upload failures

### 4. Portfolio Display (`CertificationSection.tsx`)
- Updated to display certificate images when available
- Falls back to icon display when no image is provided
- Images are displayed with proper styling and aspect ratio

### 5. Admin Page (`/admin/certifications/page.tsx`)
- Added image preview in certification cards
- Added "View Image" link for quick access to certificate images

## File Structure
```
Certificate File (PDF/Image) - for official certificate documents
Certificate Image (Image only) - for visual display in portfolio
```

## Features
- **Separate file handling**: Certificate files (PDFs) and images are handled separately
- **Image optimization**: Images are resized and optimized for web display
- **Fallback display**: Icons are shown when no image is available
- **Responsive design**: Images adapt to different screen sizes
- **File validation**: Proper validation for file types and sizes
- **Error handling**: Comprehensive error handling for upload failures

## Usage
1. In the admin panel, go to Certifications
2. When adding/editing a certification:
   - Upload the official certificate file (PDF) in the "Certificate File" field
   - Upload a visual image of the certificate in the "Certificate Image" field
3. The certificate image will be displayed prominently in the portfolio
4. The certificate file provides a downloadable/viewable document

## File Types Supported
- **Certificate Images**: JPG, PNG, WebP (max 5MB)
- **Certificate Files**: PDF, JPG, PNG, WebP (max 10MB)

## Benefits
- Better visual presentation in the portfolio
- Separate handling of official documents and display images
- Improved user experience with visual certificate previews
- Professional appearance in the portfolio section
