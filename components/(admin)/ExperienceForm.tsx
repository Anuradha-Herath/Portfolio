"use client";

import React, { useState, useEffect } from 'react';
import { Experience } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';

interface ExperienceFormProps {
  experience?: Experience | null;
  onSave: () => void;
  onCancel: () => void;
}

export function ExperienceForm({ experience, onSave, onCancel }: ExperienceFormProps) {
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    start_date: '',
    end_date: '',
    description: '',
    technologies: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (experience) {
      setFormData({
        company: experience.company,
        position: experience.position,
        location: experience.location,
        start_date: experience.start_date,
        end_date: experience.end_date || '',
        description: experience.description,
        technologies: experience.technologies.join(', ')
      });
    }
  }, [experience]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const experienceData = {
      ...formData,
      technologies: formData.technologies.split(',').map(tech => tech.trim()).filter(Boolean),
      end_date: formData.end_date || null
    };

    try {
      const response = await fetch('/api/experiences', {
        method: experience ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experience ? { id: experience.id, ...experienceData } : experienceData)
      });

      if (response.ok) {
        onSave();
      } else {
        console.error('Failed to save experience');
      }
    } catch (error) {
      console.error('Error saving experience:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Heading level={3} className="mb-4">
          {experience ? 'Edit Experience' : 'Add New Experience'}
        </Heading>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              required
              disabled={isSubmitting}
            />
            <Input
              label="Position"
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              required
              disabled={isSubmitting}
            />
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              required
              disabled={isSubmitting}
            />
            <Input
              label="Start Date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({...formData, start_date: e.target.value})}
              required
              disabled={isSubmitting}
            />
            <Input
              label="End Date (optional)"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({...formData, end_date: e.target.value})}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
              required
              disabled={isSubmitting}
            />
          </div>
          <Input
            label="Technologies (comma-separated)"
            value={formData.technologies}
            onChange={(e) => setFormData({...formData, technologies: e.target.value})}
            placeholder="React, TypeScript, Node.js"
            required
            disabled={isSubmitting}
          />
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (experience ? 'Update' : 'Create')} Experience
            </Button>
            <Button 
              type="button" 
              onClick={onCancel} 
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
