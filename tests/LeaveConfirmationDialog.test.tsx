import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LeaveConfirmationDialog } from '@/components/dialogs/LeaveConfirmationDialog';

describe('LeaveConfirmationDialog', () => {
  it('does not render into DOM when isOpen is false', () => {
    const { container } = render(
      <LeaveConfirmationDialog
        isOpen={false}
        onStay={vi.fn()}
        onLeave={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders dialog semantics and content when isOpen is true', () => {
    render(
      <LeaveConfirmationDialog
        isOpen={true}
        title="Leave this page?"
        message="You have unsaved changes."
        destination="/home"
        onStay={vi.fn()}
        onLeave={vi.fn()}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Leave this page?')).toBeInTheDocument();
    expect(screen.getByText('You have unsaved changes.')).toBeInTheDocument();
    expect(screen.getByText('/home')).toBeInTheDocument();
  });

  it('calls onStay when "Stay on Page" button is clicked', () => {
    const onStay = vi.fn();
    const onLeave = vi.fn();

    render(
      <LeaveConfirmationDialog
        isOpen={true}
        onStay={onStay}
        onLeave={onLeave}
      />
    );

    const stayButton = screen.getByRole('button', { name: /Stay on Page/i });
    fireEvent.click(stayButton);

    expect(onStay).toHaveBeenCalledTimes(1);
    expect(onLeave).not.toHaveBeenCalled();
  });

  it('calls onLeave when "Leave Without Saving" button is clicked', () => {
    const onStay = vi.fn();
    const onLeave = vi.fn();

    render(
      <LeaveConfirmationDialog
        isOpen={true}
        onStay={onStay}
        onLeave={onLeave}
      />
    );

    const leaveButton = screen.getByRole('button', { name: /Leave Without Saving/i });
    fireEvent.click(leaveButton);

    expect(onLeave).toHaveBeenCalledTimes(1);
    expect(onStay).not.toHaveBeenCalled();
  });

  it('calls onStay when Escape key is pressed', () => {
    const onStay = vi.fn();
    const onLeave = vi.fn();

    render(
      <LeaveConfirmationDialog
        isOpen={true}
        onStay={onStay}
        onLeave={onLeave}
      />
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onStay).toHaveBeenCalledTimes(1);
  });
});
