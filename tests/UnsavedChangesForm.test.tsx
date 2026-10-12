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
    replace: vi.fn(),
  }),
}));

function renderFormWithProvider() {
  return render(
    <UnsavedChangesProvider>
      <UnsavedChangesForm />
    </UnsavedChangesProvider>
  );
}

describe('UnsavedChangesForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders in Pristine state initially', () => {
    renderFormWithProvider();

    expect(screen.getByRole('heading', { name: /Project Registration Form/i })).toBeInTheDocument();
    expect(screen.getByText('Pristine (Clean)')).toBeInTheDocument();
    expect(screen.getByText('No (Matches Baseline)')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('becomes Dirty when a user modifies a field, and returns to Pristine when value is restored', async () => {
    const user = userEvent.setup();
    renderFormWithProvider();

    const nameInput = screen.getByLabelText(/Full Name/i);

    // Type text into nameInput
    await user.type(nameInput, 'Alice');

    // Status should become Dirty
    expect(screen.getByText('Dirty (Unsaved Changes)')).toBeInTheDocument();
    expect(screen.getByText('Yes (Differences Exist)')).toBeInTheDocument();
    expect(screen.getByText('Active (Guarded)')).toBeInTheDocument();

    // Clear text back to initial empty string
    await user.clear(nameInput);

    // Status should return to Pristine!
    await waitFor(() => {
      expect(screen.getByText('Pristine (Clean)')).toBeInTheDocument();
      expect(screen.getByText('No (Matches Baseline)')).toBeInTheDocument();
      expect(screen.getByText('Inactive')).toBeInTheDocument();
    });
  });

  it('displays validation errors when submitting with missing required fields', async () => {
    renderFormWithProvider();

    const submitButton = screen.getByRole('button', { name: /Submit Form/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Full Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email Address is required.')).toBeInTheDocument();
    expect(screen.getByText('Message is required.')).toBeInTheDocument();
    expect(screen.getByText('You must agree to the Terms and Conditions.')).toBeInTheDocument();
  });

  it('preserves user input and stays dirty when submission fails', async () => {
    const user = userEvent.setup();
    renderFormWithProvider();

    // Fill valid data
    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
    await user.type(screen.getByLabelText(/Email Address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Message/i), 'This is a long valid test message.');
    await user.click(screen.getByRole('checkbox', { name: /I acknowledge and agree/i }));

    // Turn on simulated failure
    const failureCheckbox = screen.getByRole('checkbox', { name: /Trigger Server Error/i });
    await user.click(failureCheckbox);

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Submit Form/i });
    await user.click(submitButton);

    // Verify error alert appears
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Submission Unsuccessful/i)).toBeInTheDocument();

    // Verify user's entered data is preserved
    expect(screen.getByLabelText(/Full Name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/Email Address/i)).toHaveValue('john@example.com');

    // Verify dirty status remains active
    expect(screen.getByText('Dirty (Unsaved Changes)')).toBeInTheDocument();
    expect(screen.getByText('Active (Guarded)')).toBeInTheDocument();
  });

  it('prompts confirmation when Reset Form is clicked on dirty form', async () => {
    const user = userEvent.setup();
    renderFormWithProvider();

    const nameInput = screen.getByLabelText(/Full Name/i);
    await user.type(nameInput, 'Bob');

    // Click Reset Form
    const resetButton = screen.getByRole('button', { name: /Reset Form/i });
    await user.click(resetButton);

    // Dialog appears asking for confirmation
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Discard changes and reset form?')).toBeInTheDocument();

    // Click "Discard & Reset"
    const confirmButton = screen.getByRole('button', { name: /Discard & Reset/i });
    await user.click(confirmButton);

    // Form is restored to empty and pristine
    expect(nameInput).toHaveValue('');
    expect(screen.getByText('Pristine (Clean)')).toBeInTheDocument();
  });
});
