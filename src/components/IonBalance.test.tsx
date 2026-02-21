import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import IonBalance from './IonBalance';
import { renderWithLocale } from '../test/helpers';
import { SAMPLE_TOTALS, ZERO_TOTALS } from '../test/fixtures';

describe('IonBalance', () => {
  it('renders nothing when all totals are zero', () => {
    const { container } = renderWithLocale(<IonBalance totals={ZERO_TOTALS} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders title', () => {
    renderWithLocale(<IonBalance totals={SAMPLE_TOTALS} />);
    expect(screen.getByText('Cation-Anion Balance')).toBeInTheDocument();
  });

  it('displays cation and anion me/L values', () => {
    renderWithLocale(<IonBalance totals={SAMPLE_TOTALS} />);
    expect(screen.getByText(/Cations:/)).toBeInTheDocument();
    expect(screen.getByText(/Anions:/)).toBeInTheDocument();
  });

  it('displays ratio value', () => {
    renderWithLocale(<IonBalance totals={SAMPLE_TOTALS} />);
    expect(screen.getByText('Ratio')).toBeInTheDocument();
    // Both the ratio value and the ideal text should be present
    expect(screen.getAllByText(/\d+\.\d+ : 1/).length).toBeGreaterThanOrEqual(1);
  });

  it('shows status text', () => {
    renderWithLocale(<IonBalance totals={SAMPLE_TOTALS} />);
    // Should show Balanced, Cation excess, or Anion excess
    const statusTexts = ['Balanced', 'Cation excess', 'Anion excess'];
    const found = statusTexts.some((text) =>
      screen.queryByText(text) !== null
    );
    expect(found).toBe(true);
  });

  it('shows deviation or Perfect', () => {
    renderWithLocale(<IonBalance totals={SAMPLE_TOTALS} />);
    const hasPerfect = screen.queryByText('Perfect') !== null;
    const hasDeviation = screen.queryByText(/deviation/) !== null;
    expect(hasPerfect || hasDeviation).toBe(true);
  });
});
