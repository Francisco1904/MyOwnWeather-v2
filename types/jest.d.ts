/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom';

// Augment the global Jest namespace with the missing matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledWith(...args: any[]): R;
      toBe(expected: any): R;
      toBeNull(): R;
      toBeInstanceOf(expected: any): R;
      toBeDefined(): R;
      toBeUndefined(): R;
      toBeTruthy(): R;
      toBeFalsy(): R;
      toEqual(expected: any): R;
      toStrictEqual(expected: any): R;
      // Add more as needed
    }
  }
}

export {};
