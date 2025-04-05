import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string into a readable format
 * @param dateString - ISO date string or other parseable date string
 * @param formatString - Optional date-fns format string (default: 'PPp')
 */
export function formatDate(dateString: string, formatString: string = 'PPp') {
  try {
    const date = parseISO(dateString);
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return the original string if parsing fails
  }
}

/**
 * DEPRECATED: This function was causing issues with keyboard navigation
 * where Tab key required double-pressing to move to the next element.
 *
 * Instead of using this utility, components should implement their own
 * onKeyDown handlers directly with:
 *
 * onKeyDown={e => {
 *   if (e.key === 'Enter' || e.key === ' ') {
 *     e.preventDefault();
 *     callbackFunction();
 *   }
 * }}
 *
 * This function is kept for backward compatibility but should be avoided
 * in new code.
 */
export function handleKeyboardActivation(e: React.KeyboardEvent, callback: () => void): void {
  // Only handle Enter and Space keys
  // Do not interfere with Tab, Shift+Tab, or any navigation keys
  if (e.key === 'Enter' || e.key === ' ') {
    // Only prevent default for Enter and Space to avoid interfering with navigation
    e.preventDefault();
    callback();
  }
  // Let all other keys (including Tab) pass through with their default behavior
}
