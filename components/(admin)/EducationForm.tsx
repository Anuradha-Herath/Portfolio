"use client";

import React, { useState } from "react";
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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
      onSubmit(formattedData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
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