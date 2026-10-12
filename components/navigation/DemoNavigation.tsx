'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';

export function DemoNavigation() {
  const pathname = usePathname();
  const { isDirty } = useUnsavedChanges();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/demo', label: 'Form' },
    { href: '/success', label: 'Success' },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-slate-900 text-sm tracking-tight">
          Unsaved Changes Demo
        </Link>

        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    active
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

          {isDirty ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Unsaved
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Clean
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
