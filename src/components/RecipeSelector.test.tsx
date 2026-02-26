import { describe, it, expect, vi } from 'vitest';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecipeSelector from './RecipeSelector';
import { renderWithLocale } from '../test/helpers';
import { saveRecipe } from '../lib/storage';

describe('RecipeSelector', () => {
  const onSelect = vi.fn();

  beforeEach(() => {
    onSelect.mockClear();
    localStorage.clear();
  });

  it('renders title', () => {
    renderWithLocale(
      <RecipeSelector selectedId="hoagland" onSelect={onSelect} />
    );
    expect(screen.getByText('Preset Recipe')).toBeInTheDocument();
  });

  it('shows built-in recipe options', () => {
    renderWithLocale(
      <RecipeSelector selectedId="hoagland" onSelect={onSelect} />
    );
    expect(screen.getByText('Hoagland Solution')).toBeInTheDocument();
    expect(screen.getByText('Lettuce')).toBeInTheDocument();
    expect(screen.getByText('Tomato')).toBeInTheDocument();
  });

  it('shows Custom option', () => {
    renderWithLocale(
      <RecipeSelector selectedId="hoagland" onSelect={onSelect} />
    );
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('shows description for selected recipe', () => {
    renderWithLocale(
      <RecipeSelector selectedId="hoagland" onSelect={onSelect} />
    );
    expect(screen.getByText(/general purpose reference/)).toBeInTheDocument();
  });

  it('calls onSelect when recipe changes', async () => {
    const user = userEvent.setup();
    renderWithLocale(
      <RecipeSelector selectedId="hoagland" onSelect={onSelect} />
    );
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'lettuce');
    expect(onSelect).toHaveBeenCalledWith('lettuce', expect.any(Array));
  });

  it('has a select element', () => {
    renderWithLocale(
      <RecipeSelector selectedId="hoagland" onSelect={onSelect} />
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('select has the correct value', () => {
    renderWithLocale(
      <RecipeSelector selectedId="hoagland" onSelect={onSelect} />
    );
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('hoagland');
  });

  it('calls onSelect with empty array when Custom is selected', async () => {
    const user = userEvent.setup();
    renderWithLocale(
      <RecipeSelector selectedId="hoagland" onSelect={onSelect} />
    );
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'custom');
    expect(onSelect).toHaveBeenCalledWith('custom', []);
  });

  it('shows saved recipes', () => {
    saveRecipe('My Custom', [{ chemicalId: 'potassium-nitrate', mgPerL: 100 }]);
    renderWithLocale(
      <RecipeSelector selectedId="hoagland" onSelect={onSelect} />
    );
    // Saved recipe appears in both dropdown option and tag pill
    expect(screen.getAllByText('My Custom').length).toBeGreaterThanOrEqual(1);
  });

  it('selects a saved recipe from dropdown', async () => {
    const saved = saveRecipe('My Custom', [{ chemicalId: 'potassium-nitrate', mgPerL: 100 }]);
    const user = userEvent.setup();
    renderWithLocale(
      <RecipeSelector selectedId="hoagland" onSelect={onSelect} />
    );
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, saved.id);
    expect(onSelect).toHaveBeenCalledWith(saved.id, expect.arrayContaining([
      expect.objectContaining({ chemicalId: 'potassium-nitrate' }),
    ]));
  });

  it('deletes a saved recipe via tag delete button', async () => {
    saveRecipe('My Custom', [{ chemicalId: 'potassium-nitrate', mgPerL: 100 }]);
    const user = userEvent.setup();
    renderWithLocale(
      <RecipeSelector selectedId="hoagland" onSelect={onSelect} />
    );
    const deleteBtn = screen.getByTitle('Remove "My Custom"');
    await user.click(deleteBtn);
    // The saved recipe tag should be removed
    expect(screen.queryByText('My Custom')).not.toBeInTheDocument();
  });

  it('resets to default when deleting the currently-selected saved recipe', async () => {
    const saved = saveRecipe('Active', [{ chemicalId: 'potassium-nitrate', mgPerL: 100 }]);
    const user = userEvent.setup();
    renderWithLocale(
      <RecipeSelector selectedId={saved.id} onSelect={onSelect} />
    );
    const deleteBtn = screen.getByTitle('Remove "Active"');
    await user.click(deleteBtn);
    // Should call onSelect with the default recipe (hoagland)
    expect(onSelect).toHaveBeenCalledWith('hoagland', expect.any(Array));
  });

  it('refreshes saved list on recipes-updated event', () => {
    renderWithLocale(
      <RecipeSelector selectedId="hoagland" onSelect={onSelect} />
    );
    // Save a recipe after render
    saveRecipe('New One', [{ chemicalId: 'potassium-nitrate', mgPerL: 50 }]);
    // Dispatch the event
    act(() => { window.dispatchEvent(new Event('recipes-updated')); });
    expect(screen.getAllByText('New One').length).toBeGreaterThanOrEqual(1);
  });
});
