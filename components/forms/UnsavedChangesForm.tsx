'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FormData,
  FormErrors,
  INITIAL_FORM_VALUES,
  isFormEquivalent,
  validateForm,
  simulateFormSubmission,
} from '@/lib/form-utils';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';

export function UnsavedChangesForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_VALUES);
  const [savedBaseline, setSavedBaseline] = useState<FormData>(INITIAL_FORM_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { isDirty, setIsDirty, setFormStatus } = useUnsavedChanges();

  // Check dirty state dynamically by comparing against saved baseline
  useEffect(() => {
    if (isSubmitting) return;
    const equivalent = isFormEquivalent(formData, savedBaseline);
    setIsDirty(!equivalent);
  }, [formData, savedBaseline, isSubmitting, setIsDirty]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setFormStatus('submitting');

    try {
      await simulateFormSubmission(formData, { delayMs: 600 });
      setSavedBaseline(formData);
      setFormStatus('submitted');
      router.push('/success');
    } catch {
      setIsSubmitting(false);
      setFormStatus('dirty');
    }
  };

  const handleReset = () => {
    if (isDirty) {
      const confirmed = window.confirm('Discard changes and reset form?');
      if (!confirmed) return;
    }
    setFormData(savedBaseline);
    setErrors({});
    setIsDirty(false);
  };

  return (
    <div className="max-w-lg mx-auto w-full">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">User Details</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your name and email.
            </p>
          </div>

          <div>
            {isDirty ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Unsaved Changes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Clean
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g. John Doe"
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-slate-300 focus:border-slate-900 focus:ring-slate-100'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g. john@example.com"
              className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-slate-300 focus:border-slate-900 focus:ring-slate-100'
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
