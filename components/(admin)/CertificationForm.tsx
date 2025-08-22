"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Certification } from '@/lib/types';

interface CertificationFormProps {
  certification?: Certification;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CertificationForm({ 
  certification, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: CertificationFormProps) {
  const [formData, setFormData] = useState({
    title: certification?.title || '',
    issuer: certification?.issuer || '',
    date: certification?.date || '',
    category: certification?.category || 'course' as 'course' | 'competition',
    credential_id: certification?.credential_id || '',
    url: certification?.url || '',
    description: certification?.description || '',
  });
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificateImage, setCertificateImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.issuer.trim()) {
      newErrors.issuer = 'Issuer is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitFormData = new FormData();
    
    // Add all form fields
    Object.entries(formData).forEach(([key, value]) => {
      submitFormData.append(key, value);
    });

    // Add certificate file if selected
    if (certificateFile) {
      submitFormData.append('certificate_file', certificateFile);
    }

    // Add certificate image if selected
    if (certificateImage) {
      submitFormData.append('certificate_image', certificateImage);
    }

    // Add ID for updates
    if (certification?.id) {
      submitFormData.append('id', certification.id);
    }

    try {
      await onSubmit(submitFormData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ 
          ...prev, 
          certificate_file: 'Only PDF and image files (JPG, PNG, WebP) are allowed' 
        }));
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          certificate_file: 'File size must be less than 10MB' 
        }));
        return;
      }

      setErrors(prev => ({ ...prev, certificate_file: '' }));
      setCertificateFile(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type - only images for certificate image
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ 
          ...prev, 
          certificate_image: 'Only image files (JPG, PNG, WebP) are allowed' 
        }));
        return;
      }

      // Validate file size (5MB for images)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          certificate_image: 'Image size must be less than 5MB' 
        }));
        return;
      }

      setErrors(prev => ({ ...prev, certificate_image: '' }));
      setCertificateImage(file);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Title *
              </label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g., AWS Certified Developer"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="issuer"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Issuer *
              </label>
              <Input
                id="issuer"
                type="text"
                value={formData.issuer}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, issuer: e.target.value }))
                }
                placeholder="e.g., Amazon Web Services"
                className={errors.issuer ? "border-red-500" : ""}
              />
              {errors.issuer && (
                <p className="text-red-500 text-sm mt-1">{errors.issuer}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Date Earned *
              </label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as "course" | "competition",
                  }))
                }
                className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.category ? "border-red-500" : ""
                }`}
              >
                <option value="course">Course Certification</option>
                <option value="competition">Competition Certificate</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="credential_id"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Credential ID
              </label>
              <Input
                id="credential_id"
                type="text"
                value={formData.credential_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    credential_id: e.target.value,
                  }))
                }
                placeholder="e.g., AWS-DEV-2023-001234"
              />
            </div>

            <div>
              <label
                htmlFor="url"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Verification URL
              </label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, url: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Brief description of the certification..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="certificate_image"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Certificate Image
            </label>
            <input
              id="certificate_image"
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload an image of the certificate for display (max 5MB).
              Supported formats: JPG, PNG, WebP
            </p>
            {errors.certificate_image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.certificate_image}
              </p>
            )}
            {certificateImage && (
              <p className="text-green-600 text-sm mt-1">
                Selected: {certificateImage.name} (
                {(certificateImage.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            {certification?.image_url && !certificateImage && (
              <div className="mt-2">
                <p className="text-blue-600 text-sm mb-2">Current image:</p>
                <img
                  src={certification.image_url}
                  alt="Current certificate"
                  className="w-32 h-24 object-cover rounded-md border"
                />
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="certificate_file"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Certificate File
            </label>
            <input
              id="certificate_file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload PDF or image file (max 10MB). Supported formats: PDF, JPG,
              PNG, WebP
            </p>
            {errors.certificate_file && (
              <p className="text-red-500 text-sm mt-1">
                {errors.certificate_file}
              </p>
            )}
            {certificateFile && (
              <p className="text-green-600 text-sm mt-1">
                Selected: {certificateFile.name} (
                {(certificateFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            {certification?.certificate_file_url && !certificateFile && (
              <p className="text-blue-600 text-sm mt-1">
                Current file:{" "}
                <a
                  href={certification.certificate_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  View Certificate
                </a>
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : certification ? "Update" : "Create"}{" "}
              Certification
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
