import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';
import { FavoriteStar } from '@/components/weather/FavoriteStar';
import '@testing-library/jest-dom';

// Mock the useFavorites hook
jest.mock('@/hooks/useFavorites', () => ({
  useFavorites: () => ({
    isFavorite: () => false,
    addFavorite: jest.fn(),
    removeFavorite: jest.fn(),
    getFavoriteByCoords: jest.fn(),
  }),
}));

describe('Keyboard Navigation Tests', () => {
  test('Button receives focus on tab and maintains consistent focus styling', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Button>First Button</Button>
        <Button>Second Button</Button>
      </div>
    );

    // Initial state - no focus
    const firstButton = screen.getByRole('button', { name: 'First Button' });
    const secondButton = screen.getByRole('button', { name: 'Second Button' });

    expect(firstButton).not.toHaveFocus();
    expect(secondButton).not.toHaveFocus();

    // Tab to first button
    await user.tab();
    expect(firstButton).toHaveFocus();
    expect(secondButton).not.toHaveFocus();

    // Tab to second button
    await user.tab();
    expect(firstButton).not.toHaveFocus();
    expect(secondButton).toHaveFocus();

    // Ensure that additional key presses don't change focus behavior
    await user.keyboard('{ArrowRight}');
    expect(secondButton).toHaveFocus();
  });

  test('FavoriteStar maintains consistent focus styling', async () => {
    const user = userEvent.setup();

    const mockLocation = {
      name: 'Test City',
      country: 'Test Country',
      lat: 0,
      lon: 0,
    };

    render(<FavoriteStar location={mockLocation} />);

    const starButton = screen.getByRole('button');

    // Tab to FavoriteStar button
    await user.tab();
    expect(starButton).toHaveFocus();

    // Ensure that additional key presses don't change focus behavior
    await user.keyboard('{ArrowRight}');
    expect(starButton).toHaveFocus();
  });
});
