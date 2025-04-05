import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Optional description for screen readers
   * Use when a visible label is not present
   */
  describedBy?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, describedBy, 'aria-label': ariaLabel, id, ...props }, ref) => {
    const hasAccessibleName = !!(
      ariaLabel ||
      props['aria-labelledby'] ||
      (id && document.querySelector(`label[for="${id}"]`))
    );

    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        id={id}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        aria-invalid={
          props['aria-invalid'] || (props.required && !props.value) ? 'true' : undefined
        }
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
