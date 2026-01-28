/**
 * Shared Form Components
 * Reusable form elements to reduce duplication across the app
 */

import * as React from 'react';
import { cn } from '@/src/lib/utils';

/**
 * FormError - Consistent error message display
 * Replaces duplicate: <p className="text-sm text-red-600 mt-1">{error}</p>
 */
interface FormErrorProps {
  message?: string | null;
  className?: string;
}

export function FormError({ message, className }: FormErrorProps) {
  if (!message) return null;
  return (
    <p className={cn('text-sm text-red-600 mt-1', className)}>
      {message}
    </p>
  );
}

/**
 * SectionTitle - Consistent section headers
 * Replaces duplicate: <h2 className="text-3xl font-bold text-center">...</h2>
 */
interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function SectionTitle({ 
  children, 
  subtitle, 
  className,
  centered = true 
}: SectionTitleProps) {
  return (
    <div className={cn('space-y-2', centered && 'text-center', className)}>
      <h2 className="text-3xl font-bold tracking-tight">{children}</h2>
      {subtitle && (
        <p className="text-muted-foreground text-lg">{subtitle}</p>
      )}
    </div>
  );
}

/**
 * FormField - Wrapper for form inputs with label and error
 */
interface FormFieldProps {
  label?: string;
  error?: string | null;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ 
  label, 
  error, 
  required, 
  children, 
  className 
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className="text-sm font-medium leading-none">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      <FormError message={error} />
    </div>
  );
}

/**
 * InputWithError - Input field with integrated error display
 */
interface InputWithErrorProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | null;
}

export const InputWithError = React.forwardRef<HTMLInputElement, InputWithErrorProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <input
          ref={ref}
          className={cn(
            'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        <FormError message={error} />
      </div>
    );
  }
);
InputWithError.displayName = 'InputWithError';
