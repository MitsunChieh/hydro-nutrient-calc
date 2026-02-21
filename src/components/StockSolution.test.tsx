import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StockSolution from './StockSolution';
import { renderWithLocale } from '../test/helpers';
import { HOAGLAND_CHEMICALS } from '../test/fixtures';

describe('StockSolution', () => {
  it('renders title', () => {
    renderWithLocale(<StockSolution chemicals={HOAGLAND_CHEMICALS} />);
    expect(screen.getByText('A/B Stock Solution')).toBeInTheDocument();
  });

  it('shows empty description when no chemicals', () => {
    renderWithLocale(<StockSolution chemicals={[]} />);
    expect(screen.getByText(/Add chemicals to your recipe first/)).toBeInTheDocument();
  });

  it('shows description when chemicals present', () => {
    renderWithLocale(<StockSolution chemicals={HOAGLAND_CHEMICALS} />);
    expect(screen.getByText(/Separate chemicals into A\/B tanks/)).toBeInTheDocument();
  });

  it('shows Tank A and Tank B labels', () => {
    renderWithLocale(<StockSolution chemicals={HOAGLAND_CHEMICALS} />);
    expect(screen.getAllByText(/Tank A/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Tank B/).length).toBeGreaterThan(0);
  });

  it('has concentration and tank volume inputs', () => {
    renderWithLocale(<StockSolution chemicals={HOAGLAND_CHEMICALS} />);
    expect(screen.getByText('Concentration')).toBeInTheDocument();
    expect(screen.getByText('Tank volume')).toBeInTheDocument();
  });

  it('shows dilute instruction', () => {
    renderWithLocale(<StockSolution chemicals={HOAGLAND_CHEMICALS} />);
    expect(screen.getByText(/Dilute:/)).toBeInTheDocument();
  });

  it('assigns calcium-nitrate to Tank A', () => {
    const chems = [{ chemicalId: 'calcium-nitrate', mgPerL: 945 }];
    renderWithLocale(<StockSolution chemicals={chems} />);
    // Should show in Tank A section
    expect(screen.getAllByText(/Tank A/).length).toBeGreaterThan(0);
    expect(screen.getByText('Calcium Nitrate Tetrahydrate')).toBeInTheDocument();
  });

  it('assigns magnesium-sulfate to Tank B', () => {
    const chems = [{ chemicalId: 'magnesium-sulfate', mgPerL: 493 }];
    renderWithLocale(<StockSolution chemicals={chems} />);
    expect(screen.getAllByText(/Tank B/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Magnesium Sulfate Heptahydrate/)).toBeInTheDocument();
  });

  it('shows correct dilution rate for default 100x', () => {
    renderWithLocale(<StockSolution chemicals={HOAGLAND_CHEMICALS} />);
    // 1000 / 100 = 10.0 mL per 1 L
    expect(screen.getByText(/10\.0 mL/)).toBeInTheDocument();
    expect(screen.getByText(/1 L/)).toBeInTheDocument();
  });

  it('updates dilution rate when concentration changes', async () => {
    const user = userEvent.setup();
    renderWithLocale(<StockSolution chemicals={HOAGLAND_CHEMICALS} />);

    const concInput = screen.getByLabelText('Concentration');
    await user.clear(concInput);
    await user.type(concInput, '200');

    // 1000 / 200 = 5.0 mL per 1 L
    expect(screen.getByText(/5\.0 mL/)).toBeInTheDocument();
  });

  it('shows chemical amounts in grams or mg', () => {
    renderWithLocale(<StockSolution chemicals={HOAGLAND_CHEMICALS} />);
    // Calcium nitrate at 945 mg/L × 100× × 10L / 1000 = 945g
    expect(screen.getByText(/945\.0 g/)).toBeInTheDocument();
  });

  it('skips chemicals with zero mgPerL', () => {
    const chems = [
      { chemicalId: 'calcium-nitrate', mgPerL: 0 },
      { chemicalId: 'potassium-nitrate', mgPerL: 506 },
    ];
    renderWithLocale(<StockSolution chemicals={chems} />);
    expect(screen.queryByText('Calcium Nitrate Tetrahydrate')).not.toBeInTheDocument();
    expect(screen.getByText('Potassium Nitrate')).toBeInTheDocument();
  });
});
