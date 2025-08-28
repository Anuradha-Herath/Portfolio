"use client";

import React, { useState, useEffect } from 'react';
import { Experience } from '@/lib/types';
import { DataCard } from '@/components/(admin)/DataCard';
import { ExperienceForm } from '@/components/(admin)/ExperienceForm';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/experiences');
      if (response.ok) {
        const data = await response.json();
        setExperiences(data);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      try {
        const response = await fetch(`/api/experiences?id=${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await fetchExperiences();
        }
      } catch (error) {
        console.error('Error deleting experience:', error);
      }
    }
  };

  const handleFormSave = async () => {
    await fetchExperiences();
    setShowForm(false);
    setEditingExperience(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingExperience(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Heading level={1}>Manage Experiences</Heading>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Experience'}
        </Button>
      </div>

      {showForm && (
        <ExperienceForm
          experience={editingExperience}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((experience) => (
          <DataCard
            key={experience.id}
            title={experience.position}
            onEdit={() => handleEdit(experience)}
            onDelete={() => handleDelete(experience.id)}
          >
            <div className="space-y-2">
              <p className="text-blue-600 dark:text-blue-400 font-medium">
                {experience.company}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {experience.location}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {new Date(experience.start_date).toLocaleDateString()} - {experience.end_date ? new Date(experience.end_date).toLocaleDateString() : 'Present'}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 overflow-hidden">
                <span className="block truncate">{experience.description}</span>
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {experience.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {tech}
                  </span>
                ))}
                {experience.technologies.length > 3 && (
                  <span className="inline-block px-2 py-1 text-xs text-gray-500">
                    +{experience.technologies.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </DataCard>
        ))}
      </div>

      {experiences.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No experiences found. Add your first experience to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}