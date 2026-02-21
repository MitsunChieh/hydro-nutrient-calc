import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import NutrientRatios from './NutrientRatios';
import { renderWithLocale } from '../test/helpers';
import { SAMPLE_TOTALS, ZERO_TOTALS } from '../test/fixtures';

describe('NutrientRatios', () => {
  it('renders nothing when all totals are zero', () => {
    const { container } = renderWithLocale(<NutrientRatios totals={ZERO_TOTALS} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders title', () => {
    renderWithLocale(<NutrientRatios totals={SAMPLE_TOTALS} />);
    expect(screen.getByText('Nutrient Ratios')).toBeInTheDocument();
  });

  it('displays N:P:K ratio', () => {
    renderWithLocale(<NutrientRatios totals={SAMPLE_TOTALS} />);
    expect(screen.getByText('N : P : K')).toBeInTheDocument();
  });

  it('displays Ca:Mg ratio', () => {
    renderWithLocale(<NutrientRatios totals={SAMPLE_TOTALS} />);
    expect(screen.getByText('Ca : Mg')).toBeInTheDocument();
  });

  it('shows NO₃:NH₄ as 100% NO₃ when no ammonium', () => {
    renderWithLocale(<NutrientRatios totals={SAMPLE_TOTALS} />);
    // NH4 is 0, so should display "100% NO₃"
    expect(screen.getByText('100% NO₃')).toBeInTheDocument();
  });

  it('displays K:Ca ratio', () => {
    renderWithLocale(<NutrientRatios totals={SAMPLE_TOTALS} />);
    expect(screen.getByText('K : Ca')).toBeInTheDocument();
  });
});
