import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-xl mx-auto py-12 text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Counter Navigation Guard
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Agar counter &lt; 10 hai to Refresh aur Browser Back button par warning aayega. 10 ya usse jyada hone par warning nahi aayega.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/demo"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors shadow-xs"
        >
          Open Counter Demo
        </Link>
      </div>

      <div className="pt-8 text-left border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-500">
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <strong className="block text-slate-800 mb-1">Browser Back</strong>
          Count &lt; 10 par Back button dabane par native warning confirm aayega.
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <strong className="block text-slate-800 mb-1">Page Refresh</strong>
          Count &lt; 10 par page refresh ya tab close karne par native prompt aayega.
        </div>
        <div className="bg-white p-3.5 rounded-lg border border-slate-200">
          <strong className="block text-slate-800 mb-1">Count &ge; 10 Safe</strong>
          10 ya usse jyada count hone par bina kisi warning ke smoothly navigate hoga.
        </div>
      </div>
    </div>
  );
}
