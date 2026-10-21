import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Intelliprivart — AI-Powered Institute Intelligence Platform',
  description: 'The Data Moat Platform for JEE & NEET Coaching Institutes | Nextute × Finance Club, IIT Patna 2026',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <AppProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
              <p>
                <strong>Intelliprivart</strong> — Round 2 Prototype for Nextute EdTech × Finance Club, IIT Patna Case Competition 2026
              </p>
              <div className="flex items-center space-x-4">
                <span>Multi-Tenant Architecture</span>
                <span>•</span>
                <span>DPDP Act 2023 Compliant</span>
                <span>•</span>
                <span className="text-teal-600 font-medium">BKT + 2PL IRT + Conformal Prediction</span>
              </div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
