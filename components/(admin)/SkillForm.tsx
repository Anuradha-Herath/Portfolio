"use client";

import { useState, useEffect, useRef } from 'react';
import { Skill } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { XIcon, UploadIcon, ImageIcon, TrashIcon } from 'lucide-react';

interface SkillFormProps {
  skill?: Skill;
  onSubmit: (skillData: Omit<Skill, 'id'>, iconFile?: File) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;
const skillCategories = ['Frontend', 'Backend', 'Database', 'Tools', 'Mobile', 'DevOps', 'Design'] as const;

export function SkillForm({ skill, onSubmit, onCancel, isLoading = false }: SkillFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    level: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert',
    icon: '',
  });
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        category: skill.category,
        level: skill.level,
        icon: skill.icon || '',
      });
      // Set icon preview if existing skill has an icon URL
      if (skill.icon && skill.icon.startsWith('http')) {
        setIconPreview(skill.icon);
      }
    }
  }, [skill]);

  const handleFileSelect = (file: File | null) => {
    if (file) {
      if (!file.type.includes('svg')) {
        alert('Please select an SVG file only.');
        return;
      }
      
      if (file.size > 1024 * 1024) { // 1MB limit
        alert('File size should be less than 1MB.');
        return;
      }

      setIconFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setIconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeIcon = () => {
    setIconFile(null);
    setIconPreview('');
    setFormData(prev => ({ ...prev, icon: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, iconFile || undefined);
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
              Icon (SVG File)
            </label>
            
            {/* File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragOver
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {iconPreview ? (
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <img 
                        src={iconPreview} 
                        alt="Icon preview" 
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeIcon}
                      className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white border-red-500"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {iconFile ? iconFile.name : 'Current icon'}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2"
                  >
                    Change Icon
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                  <div className="mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 mx-auto"
                    >
                      <UploadIcon className="h-4 w-4" />
                      Upload SVG Icon
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    Drag and drop an SVG file here, or click to browse
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    SVG files only, max 1MB
                  </p>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg,image/svg+xml"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
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
