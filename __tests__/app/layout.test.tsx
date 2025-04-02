import React from 'react';
import { render } from '@testing-library/react';
import RootLayout from '@/app/layout';

// Mock ThemeProvider component
jest.mock('@/components/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

// Mock next/font
jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mocked-inter-class',
  }),
}));

describe('RootLayout', () => {
  it('renders correctly with children', () => {
    const { container, getByTestId } = render(
      <RootLayout>
        <div data-testid="child-content">Test Content</div>
      </RootLayout>
    );

    // Check if ThemeProvider is rendered
    const themeProvider = getByTestId('theme-provider');
    expect(themeProvider).toBeInTheDocument();

    // Check if the child content is rendered
    const childContent = getByTestId('child-content');
    expect(childContent).toBeInTheDocument();
    expect(childContent.textContent).toBe('Test Content');

    // Check if html has the correct lang attribute
    const html = container.parentElement;
    expect(html?.getAttribute('lang')).toBe('en');
  });
});
