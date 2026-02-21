import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WaterProfileInput from './WaterProfileInput';
import { renderWithLocale } from '../test/helpers';
import { setWaterProfile } from '../lib/storage';

describe('WaterProfileInput', () => {
  const onChange = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    onChange.mockClear();
  });

  it('renders title', () => {
    renderWithLocale(<WaterProfileInput workspaceId="test" onChange={onChange} />);
    expect(screen.getByText('Water Profile')).toBeInTheDocument();
  });

  it('has a toggle checkbox', () => {
    renderWithLocale(<WaterProfileInput workspaceId="test" onChange={onChange} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('shows "Off" when disabled', () => {
    renderWithLocale(<WaterProfileInput workspaceId="test" onChange={onChange} />);
    expect(screen.getByText('Off')).toBeInTheDocument();
  });

  it('shows ion inputs when enabled', async () => {
    const user = userEvent.setup();
    renderWithLocale(<WaterProfileInput workspaceId="test" onChange={onChange} />);
    await act(async () => {
      await user.click(screen.getByRole('checkbox'));
    });
    expect(screen.getByText('Ca')).toBeInTheDocument();
    expect(screen.getByText('Mg')).toBeInTheDocument();
    expect(screen.getByText('Na')).toBeInTheDocument();
  });

  it('shows description when enabled', async () => {
    const user = userEvent.setup();
    renderWithLocale(<WaterProfileInput workspaceId="test" onChange={onChange} />);
    await act(async () => {
      await user.click(screen.getByRole('checkbox'));
    });
    expect(screen.getByText(/tap\/source water/)).toBeInTheDocument();
  });

  it('calls onChange when toggled on', async () => {
    const user = userEvent.setup();
    renderWithLocale(<WaterProfileInput workspaceId="test" onChange={onChange} />);
    await act(async () => {
      await user.click(screen.getByRole('checkbox'));
    });
    expect(onChange).toHaveBeenCalled();
  });

  it('calls onChange(null) when toggled off', async () => {
    const user = userEvent.setup();
    renderWithLocale(<WaterProfileInput workspaceId="test" onChange={onChange} />);
    // Toggle on
    await act(async () => { await user.click(screen.getByRole('checkbox')); });
    onChange.mockClear();
    // Toggle off
    await act(async () => { await user.click(screen.getByRole('checkbox')); });
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('updates ion value and calls onChange with profile', async () => {
    const user = userEvent.setup();
    renderWithLocale(<WaterProfileInput workspaceId="test" onChange={onChange} />);
    // Enable
    await act(async () => { await user.click(screen.getByRole('checkbox')); });
    onChange.mockClear();

    // Type into Ca input
    const caInput = screen.getByLabelText('Ca');
    await user.type(caInput, '50');

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall).toHaveProperty('ions');
  });

  it('shows source name input when enabled', async () => {
    const user = userEvent.setup();
    renderWithLocale(<WaterProfileInput workspaceId="test" onChange={onChange} />);
    await act(async () => { await user.click(screen.getByRole('checkbox')); });
    expect(screen.getByPlaceholderText(/Water source name/)).toBeInTheDocument();
  });

  it('loads saved profile from storage on mount', () => {
    setWaterProfile('test', { name: 'City Water', ions: { Ca: 40, Mg: 15 } });
    renderWithLocale(<WaterProfileInput workspaceId="test" onChange={onChange} />);
    // Should show enabled state with "Subtracting" text
    expect(screen.getByText('Subtracting')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'City Water' })
    );
  });
});
