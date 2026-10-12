import { describe, it, expect } from 'vitest';
import {
  isFormEquivalent,
  validateForm,
  simulateFormSubmission,
  INITIAL_FORM_VALUES,
  FormData,
} from '@/lib/form-utils';

describe('form-utils', () => {
  it('identifies identical form data as equivalent', () => {
    const a: FormData = { name: 'John', email: 'john@example.com' };
    const b: FormData = { name: 'John', email: 'john@example.com' };
    expect(isFormEquivalent(a, b)).toBe(true);
  });

  it('detects changes when name or email differs', () => {
    const a: FormData = { name: 'John', email: 'john@example.com' };
    const b: FormData = { name: 'John', email: 'other@example.com' };
    expect(isFormEquivalent(a, b)).toBe(false);
  });

  it('returns to pristine when edited values are restored to baseline', () => {
    const baseline = { ...INITIAL_FORM_VALUES };
    const modified: FormData = { name: 'Jane', email: '' };
    expect(isFormEquivalent(modified, baseline)).toBe(false);

    const restored: FormData = { name: '', email: '' };
    expect(isFormEquivalent(restored, baseline)).toBe(true);
  });

  it('validates required name and email format', () => {
    const emptyErrors = validateForm({ name: '', email: '' });
    expect(emptyErrors.name).toBeDefined();
    expect(emptyErrors.email).toBeDefined();

    const invalidEmailErrors = validateForm({ name: 'John', email: 'not-an-email' });
    expect(invalidEmailErrors.name).toBeUndefined();
    expect(invalidEmailErrors.email).toBe('Please enter a valid email address.');

    const validErrors = validateForm({ name: 'John', email: 'john@example.com' });
    expect(Object.keys(validErrors).length).toBe(0);
  });

  it('simulates form submission', async () => {
    const result = await simulateFormSubmission(
      { name: 'John', email: 'john@example.com' },
      { delayMs: 10 }
    );
    expect(result.success).toBe(true);
  });
});
