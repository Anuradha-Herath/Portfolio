"use client";

import { useState, useEffect } from 'react';
import { Skill } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { DataCard } from '@/components/(admin)/DataCard';
import { SkillForm } from '@/components/(admin)/SkillForm';
import { PlusIcon } from 'lucide-react';

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills');
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (skillData: Omit<Skill, 'id'>, iconFile?: File) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('admin-token');
      const url = '/api/skills';
      const method = editingSkill ? 'PUT' : 'POST';
      
      // Create FormData to handle file upload
      const formData = new FormData();
      
      const dataToSend = editingSkill 
        ? { id: editingSkill.id, ...skillData }
        : skillData;
      
      formData.append('skillData', JSON.stringify(dataToSend));
      
      if (iconFile) {
        formData.append('iconFile', iconFile);
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        await fetchSkills();
        setShowForm(false);
        setEditingSkill(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save skill');
      }
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('An error occurred while saving the skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setShowForm(true);
  };

  const handleDelete = async (skill: Skill) => {
    if (!confirm(`Are you sure you want to delete "${skill.name}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('admin-token');
      const response = await fetch(`/api/skills?id=${skill.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchSkills();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete skill');
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('An error occurred while deleting the skill');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSkill(null);
  };

  const categories = ['All', ...Array.from(new Set(skills.map(skill => skill.category)))];
  
  const filteredSkills = selectedCategory === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Advanced': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Beginner': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    }
  };

  if (showForm) {
    return (
      <div className="space-y-8">
        <SkillForm
          skill={editingSkill || undefined}
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
            Skills
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your technical skills and expertise
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <PlusIcon className="h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredSkills.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {selectedCategory === 'All' 
              ? 'No skills found. Add your first skill!'
              : `No skills found in ${selectedCategory} category.`
            }
          </p>
          <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 mx-auto">
            <PlusIcon className="h-4 w-4" />
            Add Skill
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSkills.map((skill) => (
            <DataCard
              key={skill.id}
              title={skill.name}
              onEdit={() => handleEdit(skill)}
              onDelete={() => handleDelete(skill)}
              className="text-center"
            >
              <div className="space-y-3">
                {skill.icon && (
                  <div className="text-2xl flex justify-center">
                    {skill.icon.startsWith('http') ? (
                      <img 
                        src={skill.icon} 
                        alt={`${skill.name} icon`}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <span>{skill.icon}</span>
                    )}
                  </div>
                )}
                
                <div className="space-y-2">
                  <span className="inline-block px-3 py-1 text-sm bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded-full">
                    {skill.category}
                  </span>
                  
                  <div>
                    <span className={`inline-block px-3 py-1 text-sm rounded-full ${getLevelColor(skill.level)}`}>
                      {skill.level}
                    </span>
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