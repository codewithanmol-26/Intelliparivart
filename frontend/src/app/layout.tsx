import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { AuthProvider } from '../context/AuthContext';
import AppShell from '../components/AppShell';

export const metadata: Metadata = {
  title: 'Intelliprivart — AI-Powered Institute Intelligence Platform',
  description: 'The Data Moat Platform for JEE & NEET Coaching Institutes | Nextute × Finance Club, IIT Patna 2026',
  icons: {
    icon: '/intelliprivart-icon.png',
    apple: '/intelliprivart-icon.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <AuthProvider>
          <AppProvider>
            <AppShell>
              {children}
            </AppShell>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
