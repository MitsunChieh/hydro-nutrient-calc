import { describe, it, expect, vi } from 'vitest';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TargetSolver from './TargetSolver';
import { renderWithLocale } from '../test/helpers';

describe('TargetSolver', () => {
  const onUnitChange = vi.fn();

  it('renders target concentrations title', () => {
    renderWithLocale(<TargetSolver unit="ppm" onUnitChange={onUnitChange} />);
    expect(screen.getByText('Target Concentrations (ppm)')).toBeInTheDocument();
  });

  it('shows Macronutrients and Micronutrients sections', () => {
    renderWithLocale(<TargetSolver unit="ppm" onUnitChange={onUnitChange} />);
    expect(screen.getAllByText('Macronutrients').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Micronutrients').length).toBeGreaterThan(0);
  });

  it('shows Available Chemicals section', () => {
    renderWithLocale(<TargetSolver unit="ppm" onUnitChange={onUnitChange} />);
    expect(screen.getByText('Available Chemicals')).toBeInTheDocument();
  });

  it('has Calculate Optimal Amounts button', () => {
    renderWithLocale(<TargetSolver unit="ppm" onUnitChange={onUnitChange} />);
    expect(screen.getByText('Calculate Optimal Amounts')).toBeInTheDocument();
  });

  it('defaults to Hoagland targets', () => {
    renderWithLocale(<TargetSolver unit="ppm" onUnitChange={onUnitChange} />);
    const selects = screen.getAllByRole('combobox');
    const presetSelect = selects[0] as HTMLSelectElement;
    expect(presetSelect.value).toBe('hoagland');
  });

  it('shows results after clicking solve', async () => {
    const user = userEvent.setup();
    renderWithLocale(<TargetSolver unit="ppm" onUnitChange={onUnitChange} />);
    await act(async () => {
      await user.click(screen.getByText('Calculate Optimal Amounts'));
    });
    expect(screen.getByText('Recommended Chemical Amounts')).toBeInTheDocument();
  });

  it('shows chemical checkboxes', () => {
    renderWithLocale(<TargetSolver unit="ppm" onUnitChange={onUnitChange} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(10);
  });

  it('shows recipe preset dropdown with clear option', () => {
    renderWithLocale(<TargetSolver unit="ppm" onUnitChange={onUnitChange} />);
    expect(screen.getByText('Clear all')).toBeInTheDocument();
  });

  it('changes targets when a different preset is selected', async () => {
    const user = userEvent.setup();
    renderWithLocale(<TargetSolver unit="ppm" onUnitChange={onUnitChange} />);

    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], 'lettuce');

    // The preset select should now be lettuce
    expect((selects[0] as HTMLSelectElement).value).toBe('lettuce');
  });

  it('clears targets when Clear all is selected', async () => {
    const user = userEvent.setup();
    renderWithLocale(<TargetSolver unit="ppm" onUnitChange={onUnitChange} />);

    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], 'clear');

    // All target inputs should be empty
    const targetInputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    const allEmpty = targetInputs.every((i) => i.value === '' || i.value === '0');
    expect(allEmpty).toBe(true);
  });

  it('toggles chemical checkboxes', async () => {
    const user = userEvent.setup();
    renderWithLocale(<TargetSolver unit="ppm" onUnitChange={onUnitChange} />);

    const checkboxes = screen.getAllByRole('checkbox');
    // Find a checked one and uncheck it
    const checkedBox = checkboxes.find((cb) => (cb as HTMLInputElement).checked);
    expect(checkedBox).toBeDefined();

    await user.click(checkedBox!);
    expect((checkedBox as HTMLInputElement).checked).toBe(false);

    // Click again to re-check
    await user.click(checkedBox!);
    expect((checkedBox as HTMLInputElement).checked).toBe(true);
  });

  it('allows editing target input values', async () => {
    const user = userEvent.setup();
    renderWithLocale(<TargetSolver unit="ppm" onUnitChange={onUnitChange} />);

    const targetInputs = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    await user.clear(targetInputs[0]);
    await user.type(targetInputs[0], '300');
    expect(targetInputs[0].value).toBe('300');
  });

  it('shows achieved ion concentrations in results', async () => {
    const user = userEvent.setup();
    renderWithLocale(<TargetSolver unit="ppm" onUnitChange={onUnitChange} />);
    await act(async () => {
      await user.click(screen.getByText('Calculate Optimal Amounts'));
    });
    // Should show IonResultsTable with ion names
    expect(screen.getAllByText(/N \(NO/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ca/).length).toBeGreaterThan(0);
  });
});
