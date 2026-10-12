import type { Metadata } from 'next';
import './globals.css';
import { UnsavedChangesProvider } from '@/hooks/useUnsavedChanges';
import { DemoNavigation } from '@/components/navigation/DemoNavigation';

export const metadata: Metadata = {
  title: 'Unsaved Form Changes Demo',
  description: 'Clean Next.js demo protecting users from losing unsaved form changes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <UnsavedChangesProvider>
          <DemoNavigation />
          <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
            {children}
          </main>
        </UnsavedChangesProvider>
      </body>
    </html>
  );
}
