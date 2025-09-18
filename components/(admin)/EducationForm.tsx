"use client";

import React, { useState, useEffect } from "react";
import { Education } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";

interface EducationFormProps {
  education?: Education;
  onSubmit: (education: Omit<Education, 'id'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function EducationForm({
  education,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: EducationFormProps) {
  const [formData, setFormData] = useState({
    institution: education?.institution || "",
    degree: education?.degree || "",
    field: education?.field || "",
    start_date: education?.start_date ? education.start_date.substring(0, 7) : "",
    end_date: education?.end_date ? education.end_date.substring(0, 7) : "",
    description: education?.description || "",
    grade: education?.grade || "",
    icon_url: education?.icon_url || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingIcon, setUploadingIcon] = useState(false);

  // Update form data when education prop changes (for editing existing records)
  useEffect(() => {
    if (education) {
      console.log('EducationForm: Updating form data with education prop:', education);
      setFormData({
        institution: education.institution || "",
        degree: education.degree || "",
        field: education.field || "",
        start_date: education.start_date ? education.start_date.substring(0, 7) : "",
        end_date: education.end_date ? education.end_date.substring(0, 7) : "",
        description: education.description || "",
        grade: education.grade || "",
        icon_url: education.icon_url || "",
      });
      console.log('EducationForm: Form initialized with icon_url:', education.icon_url);
    }
  }, [education]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.institution.trim()) {
      newErrors.institution = "Institution is required";
    }
    if (!formData.degree.trim()) {
      newErrors.degree = "Degree is required";
    }
    if (!formData.field.trim()) {
      newErrors.field = "Field of study is required";
    }
    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }
    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      newErrors.end_date = "End date must be after start date";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Convert YYYY-MM format to YYYY-MM-01 for database compatibility
      // Handle empty end_date for ongoing education
      const formattedData = {
        ...formData,
        start_date: formData.start_date + "-01",
        end_date: formData.end_date ? formData.end_date + "-01" : null,
      };
      console.log('EducationForm: Submitting form data:', formattedData);
      console.log('EducationForm: Icon URL in submission:', formattedData.icon_url);
      onSubmit(formattedData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleIconUpload = async (file: File) => {
    if (!file) return;

    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    setUploadingIcon(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('fileName', `${formData.institution || "education"}-icon`);

      const response = await fetch('/api/upload/education-icons', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload icon');
      }

      const data = await response.json();
      console.log('Upload successful, received URL:', data.url);
      console.log('Previous formData.icon_url:', formData.icon_url);
      setFormData(prev => {
        const updated = { ...prev, icon_url: data.url };
        console.log('Updated formData with new icon_url:', updated.icon_url);
        return updated;
      });
    } catch (error) {
      console.error("Error uploading icon:", error);
      setErrors(prev => ({
        ...prev,
        icon: error instanceof Error ? error.message : "Failed to upload icon"
      }));
    } finally {
      setUploadingIcon(false);
    }
  };

  const handleIconRemove = () => {
    setFormData(prev => ({ ...prev, icon_url: "" }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6">
        {/* Style for white calendar icons */}
        <style dangerouslySetInnerHTML={{
          __html: `
            input[type="month"]::-webkit-calendar-picker-indicator {
              filter: invert(1);
            }
            input[type="month"]::-moz-calendar-picker-indicator {
              filter: invert(1);
            }
          `
        }} />

        <h2 className="text-2xl font-bold mb-6 text-[var(--foreground)]">
          {education ? "Edit Education" : "Add New Education"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Institution *
            </label>
            <Input
              type="text"
              value={formData.institution}
              onChange={(e) => handleChange("institution", e.target.value)}
              placeholder="e.g., University of Moratuwa"
              className={errors.institution ? "border-red-500" : ""}
            />
            {errors.institution && (
              <p className="text-red-500 text-sm mt-1">{errors.institution}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Institution Icon
            </label>
            <div className="space-y-3">
              {formData.icon_url && (
                <div className="flex items-center space-x-3 p-3 bg-[var(--background-secondary)] rounded-lg">
                  <img
                    src={formData.icon_url}
                    alt="Institution icon"
                    className="w-12 h-12 object-contain rounded"
                    onError={(e) => {
                      console.error('Failed to load icon in form:', formData.icon_url);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => console.log('Icon loaded in form successfully:', formData.icon_url)}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-[var(--foreground)]">Current icon</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleIconRemove}
                    disabled={uploadingIcon}
                  >
                    Remove
                  </Button>
                </div>
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleIconUpload(file);
                    }
                  }}
                  disabled={uploadingIcon}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent)] file:text-white hover:file:bg-[var(--accent-hover)]"
                />
                {uploadingIcon && (
                  <p className="text-sm text-[var(--foreground-secondary)] mt-2">
                    Uploading icon...
                  </p>
                )}
                {errors.icon && (
                  <p className="text-red-500 text-sm mt-1">{errors.icon}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Degree *
              </label>
              <Input
                type="text"
                value={formData.degree}
                onChange={(e) => handleChange("degree", e.target.value)}
                placeholder="e.g., Bachelor of Science"
                className={errors.degree ? "border-red-500" : ""}
              />
              {errors.degree && (
                <p className="text-red-500 text-sm mt-1">{errors.degree}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Field of Study *
              </label>
              <Input
                type="text"
                value={formData.field}
                onChange={(e) => handleChange("field", e.target.value)}
                placeholder="e.g., Computer Science and Engineering"
                className={errors.field ? "border-red-500" : ""}
              />
              {errors.field && (
                <p className="text-red-500 text-sm mt-1">{errors.field}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Start Date *
              </label>
              <Input
                type="month"
                value={formData.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
                className={errors.start_date ? "border-red-500" : ""}
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                End Date (leave empty if ongoing)
              </label>
              <Input
                type="month"
                value={formData.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
                className={errors.end_date ? "border-red-500" : ""}
              />
              {errors.end_date && (
                <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Grade/GPA
            </label>
            <Input
              type="text"
              value={formData.grade}
              onChange={(e) => handleChange("grade", e.target.value)}
              placeholder="e.g., First Class Honors, 3.8 GPA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe your education experience, achievements, etc."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg bg-[var(--background)] text-[var(--foreground)] border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-vertical ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? "Saving..." : education ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}