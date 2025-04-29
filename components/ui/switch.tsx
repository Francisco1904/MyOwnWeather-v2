'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  /**
   * An accessible label for the switch when no visible label is provided
   */
  ariaLabel?: string;
  /**
   * Specify if this is a theme toggle to keep its unique styling
   */
  isThemeToggle?: boolean;
}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, ariaLabel, isThemeToggle = false, ...props }, ref) => (
    <SwitchPrimitives.Root
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-white/30 dark:data-[state=unchecked]:bg-slate-700/50',
        isThemeToggle
          ? 'data-[state=checked]:bg-slate-700'
          : 'data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-slate-500',
        className
      )}
      {...props}
      ref={ref}
      aria-label={ariaLabel || (props.checked ? 'Enabled' : 'Disabled')}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
          isThemeToggle
            ? 'bg-white'
            : 'bg-white dark:data-[state=checked]:bg-white/90 dark:data-[state=unchecked]:bg-white/80'
        )}
      />
    </SwitchPrimitives.Root>
  )
);

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
