import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="max-w-md mx-auto py-12 text-center space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-4">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          ✓
        </div>

        <h1 className="text-xl font-semibold text-slate-900">
          Saved Successfully
        </h1>
        <p className="text-xs text-slate-500">
          Your changes have been saved. Unsaved change warnings have been cleared.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <Link
            href="/demo"
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Back to Form
          </Link>
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
