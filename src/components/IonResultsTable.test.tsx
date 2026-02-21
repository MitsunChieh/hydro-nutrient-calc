import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IonResultsTable from './IonResultsTable';
import { renderWithLocale } from '../test/helpers';
import { SAMPLE_TOTALS } from '../test/fixtures';

describe('IonResultsTable', () => {
  const onUnitChange = vi.fn();

  beforeEach(() => {
    onUnitChange.mockClear();
  });

  it('renders title', () => {
    renderWithLocale(
      <IonResultsTable totals={SAMPLE_TOTALS} unit="ppm" onUnitChange={onUnitChange} />
    );
    expect(screen.getByText('Ion Concentrations')).toBeInTheDocument();
  });

  it('renders ppm and me/L toggle buttons', () => {
    renderWithLocale(
      <IonResultsTable totals={SAMPLE_TOTALS} unit="ppm" onUnitChange={onUnitChange} />
    );
    const buttons = screen.getAllByRole('button');
    const ppmBtn = buttons.find((b) => b.textContent === 'ppm');
    const meBtn = buttons.find((b) => b.textContent === 'me/L');
    expect(ppmBtn).toBeTruthy();
    expect(meBtn).toBeTruthy();
  });

  it('calls onUnitChange when me/L button clicked', async () => {
    const user = userEvent.setup();
    renderWithLocale(
      <IonResultsTable totals={SAMPLE_TOTALS} unit="ppm" onUnitChange={onUnitChange} />
    );
    const buttons = screen.getAllByRole('button');
    const meBtn = buttons.find((b) => b.textContent === 'me/L')!;
    await user.click(meBtn);
    expect(onUnitChange).toHaveBeenCalledWith('mePerL');
  });

  it('shows Macronutrients and Micronutrients section headers', () => {
    renderWithLocale(
      <IonResultsTable totals={SAMPLE_TOTALS} unit="ppm" onUnitChange={onUnitChange} />
    );
    expect(screen.getByText('Macronutrients')).toBeInTheDocument();
    expect(screen.getByText('Micronutrients')).toBeInTheDocument();
  });

  it('shows EC badge when EC > 0', () => {
    renderWithLocale(
      <IonResultsTable totals={SAMPLE_TOTALS} unit="ppm" onUnitChange={onUnitChange} />
    );
    expect(screen.getByText('Est. EC')).toBeInTheDocument();
    expect(screen.getByText(/mS\/cm/)).toBeInTheDocument();
  });

  it('renders table element', () => {
    renderWithLocale(
      <IonResultsTable totals={SAMPLE_TOTALS} unit="ppm" onUnitChange={onUnitChange} />
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('shows Delta column when targets provided', () => {
    const targets = [{ ion: 'K' as const, ppm: 200 }];
    renderWithLocale(
      <IonResultsTable totals={SAMPLE_TOTALS} unit="ppm" onUnitChange={onUnitChange} targets={targets} />
    );
    expect(screen.getByText('Delta')).toBeInTheDocument();
  });

  it('does not show Delta column without targets', () => {
    renderWithLocale(
      <IonResultsTable totals={SAMPLE_TOTALS} unit="ppm" onUnitChange={onUnitChange} />
    );
    expect(screen.queryByText('Delta')).not.toBeInTheDocument();
  });

  it('shows range indicators for out-of-range values', () => {
    const lowKTotals = SAMPLE_TOTALS.map((t) =>
      t.ion === 'K' ? { ...t, ppm: 50 } : t
    );
    renderWithLocale(
      <IonResultsTable totals={lowKTotals} unit="ppm" onUnitChange={onUnitChange} />
    );
    expect(screen.getAllByText('▼').length).toBeGreaterThan(0);
  });

  it('shows ion labels', () => {
    renderWithLocale(
      <IonResultsTable totals={SAMPLE_TOTALS} unit="ppm" onUnitChange={onUnitChange} />
    );
    expect(screen.getByText('K')).toBeInTheDocument();
    expect(screen.getByText('Ca')).toBeInTheDocument();
    expect(screen.getByText('P')).toBeInTheDocument();
  });
});
