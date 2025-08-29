"use client";

import React, { useState } from 'react';
import { Project } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { GripVertical, GithubIcon, ExternalLinkIcon, SaveIcon, XIcon } from 'lucide-react';

interface ProjectReorderProps {
  projects: Project[];
  onReorder: (reorderedProjects: Project[]) => void;
  onCancel: () => void;
}

export function ProjectReorder({ projects: initialProjects, onReorder, onCancel }: ProjectReorderProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newProjects = [...projects];
    const draggedProject = newProjects[draggedIndex];

    // Remove dragged item
    newProjects.splice(draggedIndex, 1);

    // Insert at new position
    newProjects.splice(dropIndex, 0, draggedProject);

    // Update order values
    const updatedProjects = newProjects.map((project, index) => ({
      ...project,
      order: index
    }));

    setProjects(updatedProjects);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update all projects with new order
      const token = localStorage.getItem('admin-token');

      for (const project of projects) {
        await fetch('/api/projects', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ id: project.id, order: project.order }),
        });
      }

      onReorder(projects);
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save new order. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Reorder Projects
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Drag and drop projects to change their display order
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <XIcon className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <SaveIcon className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Order'}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`cursor-move transition-all duration-200 ${
              draggedIndex === index
                ? 'opacity-50 scale-95'
                : 'hover:shadow-md'
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <Card>
              <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Drag Handle */}
                <div className="flex-shrink-0">
                  <GripVertical className="h-5 w-5 text-slate-400" />
                </div>

                {/* Order Number */}
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>

                {/* Project Image */}
                <div className="flex-shrink-0">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                      <span className="text-slate-500 text-xs">No Image</span>
                    </div>
                  )}
                </div>

                {/* Project Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    {project.featured && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Featured
                      </span>
                    )}
                    <span className="text-xs text-slate-500">
                      Status: {project.status}
                    </span>
                    <span className="text-xs text-slate-500">
                      Type: {project.type}
                    </span>
                  </div>
                </div>

                {/* Links */}
                <div className="flex-shrink-0 flex gap-2">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GithubIcon className="h-5 w-5" />
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLinkIcon className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">
            No projects to reorder
          </p>
        </div>
      )}
    </div>
  );
}
