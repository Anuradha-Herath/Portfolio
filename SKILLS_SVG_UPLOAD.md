# Skills SVG Icon Upload Feature

## Overview
The skills form now supports uploading SVG files as icons, which are stored in Supabase Storage and displayed throughout the portfolio.

## Features
- **SVG File Upload**: Drag and drop or click to upload SVG icons
- **File Validation**: Only SVG files are accepted (max 1MB)
- **Preview**: Real-time preview of uploaded icons
- **Storage**: Icons are stored in Supabase Storage bucket
- **Cleanup**: Old icons are automatically deleted when updated or skill is removed

## How to Use

### Adding a Skill with Icon
1. Navigate to Admin > Skills
2. Click "Add Skill"
3. Fill in the skill details (name, category, level)
4. In the "Icon (SVG File)" section:
   - Drag and drop an SVG file onto the upload area, OR
   - Click "Upload SVG Icon" to browse for a file
5. Preview the icon in the upload area
6. Click "Create Skill" to save

### Editing a Skill Icon
1. Click "Edit" on any existing skill
2. To change the icon:
   - Upload a new SVG file (replaces the old one)
   - Or click the trash icon to remove the current icon
3. Click "Update Skill" to save changes

### File Requirements
- **Format**: SVG files only (.svg)
- **Size**: Maximum 1MB
- **Naming**: Files are automatically renamed with timestamps to prevent conflicts

## Technical Implementation

### Storage Structure
```
Supabase Storage Bucket: skill-icons/
├── [timestamp]-react.svg
├── [timestamp]-nodejs.svg
└── [timestamp]-typescript.svg
```

### Display Logic
- **Admin Panel**: Icons display as small images in skill cards
- **Portfolio**: Icons appear next to skill names in the skills section
- **Fallback**: If no icon is uploaded, skills display without icons (graceful degradation)

### API Endpoints
- `POST /api/skills` - Create skill with optional icon upload
- `PUT /api/skills` - Update skill with optional icon upload/replacement
- `DELETE /api/skills` - Delete skill and associated icon
- `POST /api/storage/init` - Initialize storage bucket (admin only)

## Database Schema
The `skills` table includes an `icon` field that stores either:
- A Supabase Storage URL for uploaded SVG files
- An emoji or text character for manual icons
- NULL for skills without icons

## Error Handling
- Invalid file types show user-friendly error messages
- File size limits are enforced client and server-side
- Storage failures don't prevent skill creation (icon field remains empty)
- Icon deletion failures don't block skill deletion
