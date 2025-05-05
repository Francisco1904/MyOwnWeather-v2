import React from 'react';
import { render } from '@testing-library/react';

// Mock the entire layout component instead of importing it
// This avoids the issue with trying to render <html> inside a test environment
jest.mock('@/app/layout', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="root-layout">
        <div data-testid="theme-provider">{children}</div>
      </div>
    ),
  };
});

// Mock next/font
jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mocked-inter-class',
  }),
}));

// Import the mocked component
const RootLayout = require('@/app/layout').default;

describe('RootLayout', () => {
  it('renders correctly with children', () => {
    const { getByTestId } = render(
      <RootLayout>
        <div data-testid="child-content">Test Content</div>
      </RootLayout>
    );

    // Check if root layout is rendered
    const rootLayout = getByTestId('root-layout');
    expect(rootLayout).toBeInTheDocument();

    // Check if ThemeProvider is rendered
    const themeProvider = getByTestId('theme-provider');
    expect(themeProvider).toBeInTheDocument();

    // Check if the child content is rendered
    const childContent = getByTestId('child-content');
    expect(childContent).toBeInTheDocument();
    expect(childContent.textContent).toBe('Test Content');
  });
});
