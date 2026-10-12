import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UnsavedChangesForm } from '@/components/forms/UnsavedChangesForm';
import { UnsavedChangesProvider } from '@/hooks/useUnsavedChanges';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

function renderForm() {
  return render(
    <UnsavedChangesProvider>
      <UnsavedChangesForm />
    </UnsavedChangesProvider>
  );
}

describe('UnsavedChangesForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders clean initially with Full Name and Email fields', () => {
    renderForm();
    expect(screen.getByText('User Details')).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByText('Clean')).toBeInTheDocument();
  });

  it('switches to Unsaved Changes when editing, and reverts to Clean when restored', async () => {
    const user = userEvent.setup();
    renderForm();

    const nameInput = screen.getByLabelText(/Full Name/i);
    await user.type(nameInput, 'Alice');

    expect(screen.getByText('Unsaved Changes')).toBeInTheDocument();

    await user.clear(nameInput);

    await waitFor(() => {
      expect(screen.getByText('Clean')).toBeInTheDocument();
    });
  });

  it('validates fields on empty submission', async () => {
    renderForm();
    const submitBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
  });

  it('resets form when reset button is clicked', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderForm();

    const nameInput = screen.getByLabelText(/Full Name/i);
    await user.type(nameInput, 'Alice');
    expect(nameInput).toHaveValue('Alice');

    const resetBtn = screen.getByRole('button', { name: /Reset/i });
    await user.click(resetBtn);

    expect(nameInput).toHaveValue('');
    expect(screen.getByText('Clean')).toBeInTheDocument();
  });

  it('submits form and navigates to success page', async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
    await user.type(screen.getByLabelText(/Email Address/i), 'john@example.com');

    const submitBtn = screen.getByRole('button', { name: /Save Changes/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/success');
    });
  });
});
