#!/bin/bash

# Run this script to apply the IP tracking migration to your Supabase database
# Make sure you have the Supabase CLI installed and configured

echo "Applying IP tracking migration..."

# Apply the migration
supabase db push

echo "Migration applied successfully!"
echo ""
echo "If you're using a hosted Supabase instance, run the following SQL in your Supabase SQL editor:"
echo ""
cat supabase-ip-tracking-migration.sql
