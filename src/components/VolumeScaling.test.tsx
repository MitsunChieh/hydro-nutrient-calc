import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import VolumeScaling from './VolumeScaling';
import { renderWithLocale } from '../test/helpers';

const chemicals = [
  { chemicalId: 'potassium-nitrate', mgPerL: 506 },
  { chemicalId: 'calcium-nitrate', mgPerL: 945 },
];

describe('VolumeScaling', () => {
  it('renders nothing for empty chemicals', () => {
    const { container } = renderWithLocale(<VolumeScaling chemicals={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders title', () => {
    renderWithLocale(<VolumeScaling chemicals={chemicals} />);
    expect(screen.getByText('Mixing Amounts')).toBeInTheDocument();
  });

  it('shows volume input defaulting to 100L', () => {
    renderWithLocale(<VolumeScaling chemicals={chemicals} />);
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input.value).toBe('100');
  });

  it('lists chemical names', () => {
    renderWithLocale(<VolumeScaling chemicals={chemicals} />);
    expect(screen.getByText('Potassium Nitrate')).toBeInTheDocument();
    expect(screen.getByText('Calcium Nitrate Tetrahydrate')).toBeInTheDocument();
  });

  it('shows scaled gram amounts', () => {
    renderWithLocale(<VolumeScaling chemicals={chemicals} />);
    // 506 mg/L × 100L = 50600 mg = 50.60 g
    expect(screen.getByText('50.60 g')).toBeInTheDocument();
    // 945 mg/L × 100L = 94500 mg = 94.50 g
    expect(screen.getByText('94.50 g')).toBeInTheDocument();
  });
});
