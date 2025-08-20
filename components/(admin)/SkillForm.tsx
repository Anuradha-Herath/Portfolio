"use client";

import { useState, useEffect } from 'react';
import { Skill } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { XIcon } from 'lucide-react';

interface SkillFormProps {
  skill?: Skill;
  onSubmit: (skillData: Omit<Skill, 'id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;
const skillCategories = ['Frontend', 'Backend', 'Database', 'Tools', 'Mobile', 'DevOps', 'Design'] as const;

export function SkillForm({ skill, onSubmit, onCancel, isLoading = false }: SkillFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert',
    icon: '',
  });

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        category: skill.category,
        level: skill.level,
        icon: skill.icon || '',
      });
    }
  }, [skill]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {skill ? 'Edit Skill' : 'Add New Skill'}
          </h2>
          <Button variant="outline" onClick={onCancel} className="p-2">
            <XIcon className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Skill Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder="Enter skill name (e.g., React, Node.js)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
              <option value="">Select a category</option>
              {skillCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Skill Level *
            </label>
            <select
              value={formData.level}
              onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as any }))}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
              {skillLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Icon (Optional)
            </label>
            <Input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              placeholder="Enter emoji or icon name"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : skill ? 'Update Skill' : 'Create Skill'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
