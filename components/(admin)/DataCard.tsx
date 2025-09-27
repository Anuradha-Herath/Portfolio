"use client";

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EditIcon, TrashIcon } from 'lucide-react';

interface DataCardProps {
  title: string;
  children: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function DataCard({ title, children, onEdit, onDelete, className = '' }: DataCardProps) {
  return (
    <Card className={`relative group hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
            {title}
          </h3>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={onEdit}
                className="h-8 w-8 p-0"
              >
                <EditIcon className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="outline"
                onClick={onDelete}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}