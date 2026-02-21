import { describe, it, expect, vi } from 'vitest';
import { screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChemicalInputs from './ChemicalInputs';
import { renderWithLocale } from '../test/helpers';

const chemicals = [
  { chemicalId: 'potassium-nitrate', mgPerL: 506 },
  { chemicalId: 'calcium-nitrate', mgPerL: 945 },
];

describe('ChemicalInputs', () => {
  it('renders title', () => {
    renderWithLocale(<ChemicalInputs chemicals={chemicals} onChange={vi.fn()} />);
    expect(screen.getByText('Chemicals (mg/L)')).toBeInTheDocument();
  });

  it('displays chemical names', () => {
    renderWithLocale(<ChemicalInputs chemicals={chemicals} onChange={vi.fn()} />);
    expect(screen.getByText('Potassium Nitrate')).toBeInTheDocument();
    expect(screen.getByText('Calcium Nitrate Tetrahydrate')).toBeInTheDocument();
  });

  it('displays chemical formulas', () => {
    renderWithLocale(<ChemicalInputs chemicals={chemicals} onChange={vi.fn()} />);
    expect(screen.getByText('KNO₃')).toBeInTheDocument();
    expect(screen.getByText('Ca(NO₃)₂·4H₂O')).toBeInTheDocument();
  });

  it('shows number inputs with values', () => {
    renderWithLocale(<ChemicalInputs chemicals={chemicals} onChange={vi.fn()} />);
    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    const values = inputs.map((i) => parseFloat(i.value)).filter((v) => !isNaN(v));
    expect(values).toContain(506);
    expect(values).toContain(945);
  });

  it('has add chemical dropdown', () => {
    renderWithLocale(<ChemicalInputs chemicals={chemicals} onChange={vi.fn()} />);
    expect(screen.getByText('Add a chemical...')).toBeInTheDocument();
  });

  it('shows remove buttons', () => {
    renderWithLocale(<ChemicalInputs chemicals={chemicals} onChange={vi.fn()} />);
    const removeButtons = screen.getAllByTitle('Remove');
    expect(removeButtons.length).toBe(2);
  });

  it('calls onChange when amount is changed', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithLocale(<ChemicalInputs chemicals={chemicals} onChange={onChange} />);

    const inputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    await user.clear(inputs[0]);
    await user.type(inputs[0], '200');

    expect(onChange).toHaveBeenCalled();
    // Should be called with updated array
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall).toHaveLength(2);
  });

  it('calls onChange when remove button is clicked (after animation)', () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    renderWithLocale(<ChemicalInputs chemicals={chemicals} onChange={onChange} />);

    const removeButtons = screen.getAllByTitle('Remove');
    fireEvent.click(removeButtons[0]);

    // Advance timer past the 200ms animation delay
    act(() => { vi.advanceTimersByTime(250); });

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall).toHaveLength(1);
    expect(lastCall[0].chemicalId).toBe('calcium-nitrate');

    vi.useRealTimers();
  });

  it('adds a chemical when selected from dropdown and Add clicked', () => {
    const onChange = vi.fn();
    renderWithLocale(<ChemicalInputs chemicals={chemicals} onChange={onChange} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'magnesium-sulfate' } });

    const addBtn = screen.getByText('Add');
    fireEvent.click(addBtn);

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall).toHaveLength(3);
    expect(lastCall[2]).toEqual({ chemicalId: 'magnesium-sulfate', mgPerL: 0 });
  });

  it('add button is disabled when no chemical selected', () => {
    renderWithLocale(<ChemicalInputs chemicals={chemicals} onChange={vi.fn()} />);
    const addBtn = screen.getByText('Add');
    expect(addBtn).toBeDisabled();
  });

  it('renders empty list when no chemicals', () => {
    renderWithLocale(<ChemicalInputs chemicals={[]} onChange={vi.fn()} />);
    expect(screen.getByText('Chemicals (mg/L)')).toBeInTheDocument();
    // Should still show add dropdown
    expect(screen.getByText('Add a chemical...')).toBeInTheDocument();
  });
});
