import React from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export function Heading({ level, children, className, gradient = false }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  const baseClasses = 'font-bold text-gray-900';
  const gradientClasses = gradient ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' : '';
  
  const sizeClasses = {
    1: 'text-4xl md:text-5xl lg:text-6xl',
    2: 'text-3xl md:text-4xl lg:text-5xl',
    3: 'text-2xl md:text-3xl lg:text-4xl',
    4: 'text-xl md:text-2xl lg:text-3xl',
    5: 'text-lg md:text-xl lg:text-2xl',
    6: 'text-base md:text-lg lg:text-xl'
  };
  
  return (
    <Tag className={cn(baseClasses, sizeClasses[level], gradientClasses, className)}>
      {children}
    </Tag>
  );
}