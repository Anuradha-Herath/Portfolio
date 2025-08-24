"use client";

import { useState, useEffect } from 'react';
import { Project } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { DataCard } from '@/components/(admin)/DataCard';
import { ProjectForm } from '@/components/(admin)/ProjectForm';
import { PlusIcon, GithubIcon, ExternalLinkIcon } from 'lucide-react';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (projectData: Omit<Project, 'id'>) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('admin-token');
      const url = editingProject ? '/api/projects' : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';
      const body = editingProject 
        ? JSON.stringify({ id: editingProject.id, ...projectData })
        : JSON.stringify(projectData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body,
      });

      if (response.ok) {
        await fetchProjects();
        setShowForm(false);
        setEditingProject(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('An error occurred while saving the project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete "${project.title}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('admin-token');
      const response = await fetch(`/api/projects?id=${project.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchProjects();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('An error occurred while deleting the project');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  if (showForm) {
    return (
      <div className="space-y-8">
        <ProjectForm
          project={editingProject || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Projects
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your portfolio projects
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No projects found. Create your first project!
          </p>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 mx-auto">
            <PlusIcon className="h-4 w-4" />
            Add Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <DataCard
              key={project.id}
              title={project.title}
              onEdit={() => handleEdit(project)}
              onDelete={() => handleDelete(project)}
            >
              <div className="space-y-3">
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                  {project.description}
                </p>

                {/* Main image */}
                {project.image_url && (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full max-h-64 object-contain rounded-lg bg-slate-100 dark:bg-slate-800"
                  />
                )}

                {/* Additional images */}
                {project.additional_images && project.additional_images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.additional_images.map((img, idx) => (
                      <img
                        key={img + idx}
                        src={img}
                        alt={`Additional ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded border bg-slate-100 dark:bg-slate-800"
                      />
                    ))}
                  </div>
                )}

                {/* Project meta info */}
                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                    Status: <span className="font-semibold">{project.status}</span>
                  </span>
                  <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                    Type: <span className="font-semibold">{project.type}</span>
                  </span>
                  {project.role && (
                    <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                      Role: <span className="font-semibold">{project.role}</span>
                    </span>
                  )}
                  {project.duration && (
                    <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                      Duration: <span className="font-semibold">{project.duration}</span>
                    </span>
                  )}
                  {project.project_type_detail && (
                    <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                      Detail: <span className="font-semibold">{project.project_type_detail}</span>
                    </span>
                  )}
                </div>

                {/* Technologies used (detailed) */}
                {project.technologies_used && (
                  <div className="mt-2 space-y-1">
                    {Object.entries(project.technologies_used).map(([cat, arr]) => (
                      arr && arr.length > 0 && (
                        <div key={cat} className="flex flex-wrap gap-1">
                          <span className="font-semibold capitalize text-xs text-slate-700 dark:text-slate-300 mr-1">{cat}:</span>
                          {arr.map((tech) => (
                            <span
                              key={tech}
                              className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )
                    ))}
                  </div>
                )}

                {/* Key features and My Contributions removed as per request */}

                {/* Featured badge and links */}
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    project.featured
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                  }`}>
                    {project.featured ? 'Featured' : 'Regular'}
                  </span>
                  <div className="flex gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        title="GitHub Repository"
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
                        title="Live Demo"
                      >
                        <ExternalLinkIcon className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </DataCard>
          ))}
        </div>
      )}
    </div>
  );
}