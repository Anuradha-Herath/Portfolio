import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  premium?: boolean;
}

export function Card({ children, className, hover = false, glow = false, premium = true }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-300 ease-out',
        premium 
          ? 'bg-[var(--surface)] border-[var(--border)] shadow-[var(--shadow-card)]'
          : 'bg-white border-gray-200 shadow-lg',
        hover && premium && 'hover:shadow-[var(--shadow-premium)] hover:border-[var(--border-light)] hover:-translate-y-1',
        hover && !premium && 'hover:shadow-xl',
        glow && 'shadow-[var(--shadow-glow)]',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('p-6 pb-4', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('p-6 pt-4 border-t border-[var(--border)]', className)}>
      {children}
    </div>
  );
}