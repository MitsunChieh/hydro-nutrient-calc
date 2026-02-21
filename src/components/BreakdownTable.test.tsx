import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import BreakdownTable from './BreakdownTable';
import { renderWithLocale } from '../test/helpers';
import { calcSolution } from '../lib/engine';
import { HOAGLAND_CHEMICALS } from '../test/fixtures';

describe('BreakdownTable', () => {
  const result = calcSolution(HOAGLAND_CHEMICALS);

  it('renders title', () => {
    renderWithLocale(<BreakdownTable result={result} />);
    expect(screen.getByText('Per-Chemical Breakdown (ppm)')).toBeInTheDocument();
  });

  it('renders a table', () => {
    renderWithLocale(<BreakdownTable result={result} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('shows chemical names in rows', () => {
    renderWithLocale(<BreakdownTable result={result} />);
    expect(screen.getByText('Potassium Nitrate')).toBeInTheDocument();
    expect(screen.getByText('Calcium Nitrate Tetrahydrate')).toBeInTheDocument();
  });

  it('shows Total row', () => {
    renderWithLocale(<BreakdownTable result={result} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('renders nothing for empty breakdown', () => {
    const emptyResult = calcSolution([]);
    const { container } = renderWithLocale(<BreakdownTable result={emptyResult} />);
    expect(container.innerHTML).toBe('');
  });
});
