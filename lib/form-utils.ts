/**
 * Simple, clean form utilities for Name and Email fields.
 */

export interface FormData {
  name: string;
  email: string;
}

export type FormErrors = Partial<Record<keyof FormData, string>>;

export type FormStatus = 'pristine' | 'dirty' | 'submitting' | 'submitted';

export const INITIAL_FORM_VALUES: Readonly<FormData> = Object.freeze({
  name: '',
  email: '',
});

/**
 * Checks equality between current form values and baseline.
 */
export function isFormEquivalent(a: FormData, b: FormData): boolean {
  return a.name.trim() === b.name.trim() && a.email.trim() === b.email.trim();
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates Name and Email.
 */
export function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required.';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  return errors;
}

/**
 * Simulated server submission.
 */
export async function simulateFormSubmission(
  data: FormData,
  options: { shouldFail?: boolean; delayMs?: number } = {}
): Promise<{ success: boolean; message: string }> {
  const delay = options.delayMs ?? 800;
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (options.shouldFail) {
    throw new Error('Simulated server error. Your input has been preserved.');
  }

  return {
    success: true,
    message: `Saved successfully for ${data.name.trim()} (${data.email.trim()}).`,
  };
}
