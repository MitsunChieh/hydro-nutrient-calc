import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NutrientCalculator from './NutrientCalculator';

describe('NutrientCalculator', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders title directly', () => {
    render(<NutrientCalculator />);
    expect(screen.getByText('Nutrient Calculator')).toBeInTheDocument();
  });

  it('has theme toggle button', () => {
    render(<NutrientCalculator />);
    const themeBtn = screen.getByLabelText('Toggle theme');
    expect(themeBtn).toBeInTheDocument();
  });

  it('has locale switcher', () => {
    render(<NutrientCalculator />);
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('shows tabs', () => {
    render(<NutrientCalculator />);
    expect(screen.getByText('Recipe Browser')).toBeInTheDocument();
    expect(screen.getByText('Target Solver')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();
  });

  it('switches tabs', async () => {
    const user = userEvent.setup();
    render(<NutrientCalculator />);

    // Click Tools tab
    await act(async () => {
      await user.click(screen.getByText('Tools'));
    });
    expect(screen.getByText('pH Adjustment Calculator')).toBeInTheDocument();
  });
});
