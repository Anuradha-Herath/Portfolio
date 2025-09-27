"use client";

import { useState, useEffect, useRef } from 'react';
import { Hero } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { SaveIcon, UploadIcon, ImageIcon } from 'lucide-react';

export default function AdminHeroPage() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchHero();
  }, []);

  const fetchHero = async () => {
    try {
      const response = await fetch('/api/hero');
      if (response.ok) {
        const data = await response.json();
        setHero(data);
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hero) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('admin-token');
      const response = await fetch('/api/hero', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(hero),
      });

      if (response.ok) {
        alert('Hero section updated successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating hero:', error);
      alert('Failed to update hero section');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleImageUpload called', e.target.files);
    const file = e.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', { name: file.name, type: file.type, size: file.size });
    setIsUploading(true);
    try {
      const token = localStorage.getItem('admin-token');
      console.log('Token from localStorage:', token ? 'present' : 'missing');

      const formData = new FormData();
      formData.append('file', file);

      console.log('Sending upload request...');

      const response = await fetch('/api/hero/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Upload response status:', response.status);
      console.log('Upload response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const { imageUrl } = await response.json();
        setHero(prev => prev ? { ...prev, profile_image_url: imageUrl } : null);
        alert('Profile image uploaded successfully!');
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (field: keyof Hero, value: string | string[]) => {
    setHero(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleRolesChange = (rolesString: string) => {
    const roles = rolesString.split(',').map(role => role.trim()).filter(role => role.length > 0);
    handleInputChange('roles', roles);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent)' }}></div>
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="text-center py-8">
        <p style={{ color: 'var(--foreground-secondary)' }}>Failed to load hero data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Heading level={1} className="text-3xl font-bold mb-2">
          Hero Section Management
        </Heading>
        <p style={{ color: 'var(--foreground-secondary)' }}>
          Manage your portfolio hero section content and profile image
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image Section */}
        <Card className="card-premium">
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <ImageIcon className="w-5 h-5" />
              Profile Image
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                {hero.profile_image_url ? (
                  <img
                    src={hero.profile_image_url}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2"
                    style={{ borderColor: 'var(--border)' }}
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hover)' }}
                  >
                    <ImageIcon className="w-8 h-8" style={{ color: 'var(--foreground-secondary)' }} />
                  </div>
                )}
              </div>
              <div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  className="flex items-center gap-2"
                  onClick={() => {
                    console.log('Upload button clicked, isUploading:', isUploading);
                    console.log('fileInputRef.current:', fileInputRef.current);
                    fileInputRef.current?.click();
                  }}
                >
                  <UploadIcon className="w-4 h-4" />
                  {isUploading ? 'Uploading...' : 'Upload New Image'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ marginBottom: '8px', display: 'block' }}
                />
                <p className="text-sm mt-1" style={{ color: 'var(--foreground-secondary)' }}>
                  JPEG, PNG, WebP, or GIF (max 5MB)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="card-premium">
          <CardHeader>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Basic Information</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  Name *
                </label>
                <Input
                  type="text"
                  value={hero.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  Title *
                </label>
                <Input
                  type="text"
                  value={hero.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Subtitle *
              </label>
              <Input
                type="text"
                value={hero.subtitle}
                onChange={(e) => handleInputChange('subtitle', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Description *
              </label>
              <textarea
                value={hero.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Roles (comma-separated)
              </label>
              <Input
                type="text"
                value={hero.roles.join(', ')}
                onChange={(e) => handleRolesChange(e.target.value)}
                placeholder="e.g., IT Undergraduate, Full Stack Developer, Problem Solver"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="card-premium">
          <CardHeader>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Social Links</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  GitHub URL
                </label>
                <Input
                  type="url"
                  value={hero.github_url || ''}
                  onChange={(e) => handleInputChange('github_url', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                  LinkedIn URL
                </label>
                <Input
                  type="url"
                  value={hero.linkedin_url || ''}
                  onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Email
              </label>
              <Input
                type="email"
                value={hero.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <SaveIcon className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}