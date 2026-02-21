import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhAdjustment from './PhAdjustment';
import { renderWithLocale } from '../test/helpers';

describe('PhAdjustment', () => {
  it('renders title', () => {
    renderWithLocale(<PhAdjustment />);
    expect(screen.getByText('pH Adjustment Calculator')).toBeInTheDocument();
  });

  it('renders description', () => {
    renderWithLocale(<PhAdjustment />);
    expect(screen.getByText(/acid or base/)).toBeInTheDocument();
  });

  it('has chemical selector', () => {
    renderWithLocale(<PhAdjustment />);
    // The select has optgroups for acids and bases
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    // Should contain acid and base chemical options
    expect(screen.getByText(/Nitric Acid/)).toBeInTheDocument();
    expect(screen.getByText(/Potassium Hydroxide/)).toBeInTheDocument();
  });

  it('has volume, concentration, and reservoir inputs', () => {
    renderWithLocale(<PhAdjustment />);
    expect(screen.getByText('Volume added')).toBeInTheDocument();
    expect(screen.getByText('Concentration')).toBeInTheDocument();
    expect(screen.getByText('Reservoir')).toBeInTheDocument();
  });

  it('shows result when inputs provided', async () => {
    const user = userEvent.setup();
    renderWithLocale(<PhAdjustment />);

    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    // volume, concentration, reservoir
    // Find by placeholder or clear and type
    await user.clear(inputs[0]);
    await user.type(inputs[0], '10');
    await user.clear(inputs[1]);
    await user.type(inputs[1], '50');
    // reservoir already has default "100"

    expect(screen.getByText(/Adding/)).toBeInTheDocument();
  });

  it('does not show result with empty inputs', () => {
    renderWithLocale(<PhAdjustment />);
    expect(screen.queryByText(/Adding/)).not.toBeInTheDocument();
  });
});
