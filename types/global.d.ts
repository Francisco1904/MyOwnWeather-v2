import { expect } from '@jest/globals';

declare global {
  const expect: typeof import('@jest/globals').expect;
}

export {};
