import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-xl mx-auto py-12 text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Unsaved Form Changes Warning
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Warns users when they have entered data and try to leave without saving.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/demo"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors shadow-xs"
        >
          Open Form
        </Link>
      </div>

      <div className="pt-8 text-left border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-500">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <strong className="block text-slate-800 mb-1">Browser Back</strong>
          Intercepts browser back button and prompts before losing input.
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <strong className="block text-slate-800 mb-1">Page Refresh</strong>
          Native prompt warns on refresh or closing tab.
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <strong className="block text-slate-800 mb-1">In-App Links</strong>
          Prompts before navigating away to other pages.
        </div>
      </div>
    </div>
  );
}
