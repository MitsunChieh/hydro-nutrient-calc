import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NutrientCalculator from './NutrientCalculator';

describe('NutrientCalculator', () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.hash = '';
  });

  it('renders workspace landing when no workspace selected', () => {
    render(<NutrientCalculator />);
    expect(screen.getByText('Hydroponic Nutrient Calculator')).toBeInTheDocument();
    expect(screen.getByText(/Create a workspace/)).toBeInTheDocument();
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

  it('enters workspace when created', async () => {
    const user = userEvent.setup();
    render(<NutrientCalculator />);

    const input = screen.getByPlaceholderText(/My Garden/);
    await user.type(input, 'Test Garden');
    await act(async () => {
      await user.click(screen.getByText('Create'));
    });

    // Should now show the workspace view with title
    expect(screen.getByText('Nutrient Calculator')).toBeInTheDocument();
  });

  it('shows tabs in workspace view', async () => {
    const user = userEvent.setup();
    render(<NutrientCalculator />);

    const input = screen.getByPlaceholderText(/My Garden/);
    await user.type(input, 'Test');
    await act(async () => {
      await user.click(screen.getByText('Create'));
    });

    expect(screen.getByText('Recipe Browser')).toBeInTheDocument();
    expect(screen.getByText('Target Solver')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();
  });

  it('switches tabs', async () => {
    const user = userEvent.setup();
    render(<NutrientCalculator />);

    const input = screen.getByPlaceholderText(/My Garden/);
    await user.type(input, 'Test');
    await act(async () => {
      await user.click(screen.getByText('Create'));
    });

    // Click Tools tab
    await act(async () => {
      await user.click(screen.getByText('Tools'));
    });
    expect(screen.getByText('pH Adjustment Calculator')).toBeInTheDocument();
  });

  it('has back button in workspace view', async () => {
    const user = userEvent.setup();
    render(<NutrientCalculator />);

    const input = screen.getByPlaceholderText(/My Garden/);
    await user.type(input, 'Test');
    await act(async () => {
      await user.click(screen.getByText('Create'));
    });

    expect(screen.getByTitle('Switch workspace')).toBeInTheDocument();
  });
});
