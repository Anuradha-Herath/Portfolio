import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  glow?: boolean;
  asChild?: boolean;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  glow = false,
  asChild = false,
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group';
  
  const variants = {
    primary: 'bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white focus:ring-[var(--accent)] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    premium: 'bg-gradient-to-r from-[var(--accent)] to-[#5856d6] hover:from-[var(--accent-light)] hover:to-[#6366f1] text-white focus:ring-[var(--accent)] shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700',
    secondary: 'bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--border-light)] focus:ring-[var(--accent)]',
    outline: 'border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white focus:ring-[var(--accent)] bg-transparent',
    ghost: 'text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] focus:ring-[var(--accent)]'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg'
  };
  
  const combinedClasses = cn(
    baseClasses, 
    variants[variant], 
    sizes[size], 
    glow && 'shadow-[var(--shadow-glow)]',
    className
  );

  if (asChild) {
    // When asChild is true, we clone the child element and apply our classes
    const child = React.Children.only(children) as React.ReactElement;
    return React.cloneElement(child, {
      className: cn(combinedClasses, child.props.className),
      ...props
    });
  }
  
  return (
    <button
      className={combinedClasses}
      {...props}
    >
      {children}
    </button>
  );
}