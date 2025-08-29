"use client";

import React, { useState, useEffect } from "react";
import { Education } from "@/lib/types";
import { EducationForm } from "@/components/(admin)/EducationForm";
import { DataCard } from "@/components/(admin)/DataCard";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Card, CardContent } from "@/components/ui/Card";

export default function AdminEducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/education");
      if (!response.ok) throw new Error("Failed to fetch education");
      const data = await response.json();
      setEducation(data);
    } catch (error) {
      console.error("Error fetching education:", error);
      setError("Failed to load education data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (educationData: Omit<Education, "id">) => {
    try {
      setSubmitting(true);
      setError(null);

      let response;
      if (editingEducation) {
        // Update existing education
        response = await fetch("/api/education", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingEducation.id, ...educationData }),
        });
      } else {
        // Create new education
        response = await fetch("/api/education", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(educationData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save education");
      }

      await fetchEducation();
      setShowForm(false);
      setEditingEducation(null);
    } catch (error) {
      console.error("Error saving education:", error);
      setError(error instanceof Error ? error.message : "Failed to save education");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (educationItem: Education) => {
    setEditingEducation(educationItem);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) {
      return;
    }

    try {
      const response = await fetch(`/api/education?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete education");
      }

      await fetchEducation();
    } catch (error) {
      console.error("Error deleting education:", error);
      setError(error instanceof Error ? error.message : "Failed to delete education");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEducation(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EducationForm
          education={editingEducation || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={submitting}
        />
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Heading level={1}>Education Management</Heading>
        <Button onClick={() => setShowForm(true)}>
          Add New Education
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {education.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-[var(--foreground-secondary)] mb-4">
              No education entries found.
            </p>
            <Button onClick={() => setShowForm(true)}>
              Add Your First Education Entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {education.map((educationItem) => (
            <DataCard
              key={educationItem.id}
              title={`${educationItem.degree} in ${educationItem.field}`}
              onEdit={() => handleEdit(educationItem)}
              onDelete={() => handleDelete(educationItem.id)}
            >
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-[var(--foreground)]">
                    {educationItem.institution}
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[var(--foreground-secondary)]">Duration: </span>
                    <span className="text-[var(--foreground)]">
                      {formatDate(educationItem.start_date)} - {educationItem.end_date ? formatDate(educationItem.end_date) : "Present"}
                    </span>
                  </div>
                  {educationItem.grade && (
                    <div>
                      <span className="text-[var(--foreground-secondary)]">Grade: </span>
                      <span className="text-[var(--foreground)]">{educationItem.grade}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
                  {educationItem.description}
                </p>
              </div>
            </DataCard>
          ))}
        </div>
      )}
    </div>
  );
}