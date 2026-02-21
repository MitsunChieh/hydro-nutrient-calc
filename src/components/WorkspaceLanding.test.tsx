import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkspaceLanding from './WorkspaceLanding';
import { renderWithLocale } from '../test/helpers';
import { createWorkspace } from '../lib/storage';

describe('WorkspaceLanding', () => {
  const onEnter = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    window.location.hash = '';
    onEnter.mockClear();
  });

  it('renders title', () => {
    renderWithLocale(<WorkspaceLanding onEnter={onEnter} />);
    expect(screen.getByText('Hydroponic Nutrient Calculator')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    renderWithLocale(<WorkspaceLanding onEnter={onEnter} />);
    expect(screen.getByText(/Create a workspace/)).toBeInTheDocument();
  });

  it('has new workspace input and create button', () => {
    renderWithLocale(<WorkspaceLanding onEnter={onEnter} />);
    expect(screen.getByPlaceholderText(/My Garden/)).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('create button is disabled when input empty', () => {
    renderWithLocale(<WorkspaceLanding onEnter={onEnter} />);
    const btn = screen.getByText('Create');
    expect(btn).toBeDisabled();
  });

  it('shows existing workspaces', () => {
    createWorkspace('Test Garden');
    renderWithLocale(<WorkspaceLanding onEnter={onEnter} />);
    expect(screen.getByText('Test Garden')).toBeInTheDocument();
    expect(screen.getByText('Your Workspaces')).toBeInTheDocument();
  });

  it('calls onEnter when workspace clicked', async () => {
    createWorkspace('My Garden');
    const user = userEvent.setup();
    renderWithLocale(<WorkspaceLanding onEnter={onEnter} />);
    await act(async () => {
      await user.click(screen.getByText('My Garden'));
    });
    expect(onEnter).toHaveBeenCalledWith('my-garden');
  });

  it('creates a workspace and calls onEnter when Create clicked', async () => {
    const user = userEvent.setup();
    renderWithLocale(<WorkspaceLanding onEnter={onEnter} />);
    const input = screen.getByPlaceholderText(/My Garden/);
    await user.type(input, 'New Project');
    await act(async () => {
      await user.click(screen.getByText('Create'));
    });
    expect(onEnter).toHaveBeenCalledWith('new-project');
  });

  it('creates workspace via Enter key', async () => {
    const user = userEvent.setup();
    renderWithLocale(<WorkspaceLanding onEnter={onEnter} />);
    const input = screen.getByPlaceholderText(/My Garden/);
    await user.type(input, 'Enter Project');
    await user.keyboard('{Enter}');
    expect(onEnter).toHaveBeenCalledWith('enter-project');
  });

  it('opens confirmation dialog when delete button clicked', async () => {
    createWorkspace('To Delete');
    const user = userEvent.setup();
    renderWithLocale(<WorkspaceLanding onEnter={onEnter} />);

    const deleteBtn = screen.getByLabelText(/Delete workspace To Delete/);
    await user.click(deleteBtn);

    // Dialog should be open
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('deletes workspace when confirmed in dialog', async () => {
    createWorkspace('To Delete');
    const user = userEvent.setup();
    renderWithLocale(<WorkspaceLanding onEnter={onEnter} />);

    const deleteBtn = screen.getByLabelText(/Delete workspace To Delete/);
    await user.click(deleteBtn);

    // Click the confirm delete button inside dialog
    const dialog = screen.getByRole('dialog');
    const confirmBtn = within(dialog).getByText('Delete workspace');
    await user.click(confirmBtn);

    // Workspace should be removed
    expect(screen.queryByText('To Delete')).not.toBeInTheDocument();
  });

  it('cancels delete when Cancel clicked in dialog', async () => {
    createWorkspace('Keep Me');
    const user = userEvent.setup();
    renderWithLocale(<WorkspaceLanding onEnter={onEnter} />);

    const deleteBtn = screen.getByLabelText(/Delete workspace Keep Me/);
    await user.click(deleteBtn);

    // Click cancel
    const dialog = screen.getByRole('dialog');
    const cancelBtn = within(dialog).getByText('Cancel');
    await user.click(cancelBtn);

    // Workspace should still be there
    expect(screen.getByText('Keep Me')).toBeInTheDocument();
  });

  it('does not call onEnter when delete button is clicked', async () => {
    createWorkspace('Some WS');
    const user = userEvent.setup();
    renderWithLocale(<WorkspaceLanding onEnter={onEnter} />);

    const deleteBtn = screen.getByLabelText(/Delete workspace Some WS/);
    await user.click(deleteBtn);

    // onEnter should not have been called
    expect(onEnter).not.toHaveBeenCalled();
  });
});
