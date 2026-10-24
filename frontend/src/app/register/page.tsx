'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { setTenantId, setRole } = useApp();

  const [formData, setFormData] = useState({
    institute_name: '',
    admin_name: '',
    email: '',
    phone: '',
    city: 'Patna',
    exam_focus: 'JEE Advanced / NEET',
    cohort_size: 500,
    password: '',
    confirm_password: '',
    agreed: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.institute_name.trim()) {
      setError('Please provide your Institute / Academy name.');
      return;
    }
    if (!formData.admin_name.trim()) {
      setError('Please provide the Director or Academic Lead name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid official email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }
    if (!formData.agreed) {
      setError('You must accept the Terms of Service and Privacy Policy to register.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await register({
        institute_name: formData.institute_name,
        admin_name: formData.admin_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        city: formData.city,
        exam_focus: formData.exam_focus,
        cohort_size: formData.cohort_size,
        role: 'owner',
      });

      setTenantId(user.tenant_id);
      setRole('owner');
      router.push('/overview');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check details or sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-xl mx-auto w-full space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block mb-1 group">
            <img
              src="/intelliprivart-logo-light.png"
              alt="Intelliprivart"
              className="h-10 sm:h-12 w-auto mx-auto object-contain group-hover:opacity-90 transition"
            />
          </Link>
          <div>
            <span className="inline-flex items-center space-x-1.5 text-teal-700 font-bold text-xs uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Nextute EdTech Partner Platform</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Register Your Coaching Institute
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Set up your institute&apos;s isolated tenant, unlock 2PL IRT psychometrics, early-warning retention models, and automated parent reporting.
          </p>
        </div>

        {/* Tab Toggle: Sign In vs Register */}
        <div className="bg-slate-200/80 p-1 rounded-xl flex items-center text-xs font-semibold">
          <Link
            href="/login"
            className="flex-1 py-2 text-center text-slate-600 hover:text-slate-900 rounded-lg transition"
          >
            Sign In to Existing Account
          </Link>
          <div className="flex-1 py-2 text-center bg-white text-teal-700 rounded-lg shadow-xs font-bold">
            Register New Institute
          </div>
        </div>

        {/* Registration Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Institute Name */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Institute / Coaching Academy Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex JEE & Medical Academy, Patna"
                  value={formData.institute_name}
                  onChange={(e) => setFormData({ ...formData, institute_name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-900"
                />
              </div>
            </div>

            {/* Director / Academic Lead Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Director / Admin Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. S. K. Narayan"
                    value={formData.admin_name}
                    onChange={(e) => setFormData({ ...formData, admin_name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Contact Phone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Official Email */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Official Institute Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="director@apex.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-900"
                />
              </div>
            </div>

            {/* City & Exam Track */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  City & State *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Patna, Bihar"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Primary Competitive Track
                </label>
                <select
                  value={formData.exam_focus}
                  onChange={(e) => setFormData({ ...formData, exam_focus: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-900 bg-white"
                >
                  <option value="JEE Advanced / NEET">JEE Advanced + NEET UG</option>
                  <option value="JEE Main & Advanced">JEE Main & Advanced Exclusively</option>
                  <option value="NEET Medical">NEET Medical Exclusively</option>
                  <option value="Foundation (9th-10th)">Foundation & Olympiads</option>
                </select>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Terms & Privacy Agreement Checkbox */}
            <div className="pt-2">
              <label className="flex items-start space-x-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreed}
                  onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-[11px] leading-relaxed">
                  I agree to the{' '}
                  <Link href="/terms" target="_blank" className="text-teal-600 font-semibold underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy-policy" target="_blank" className="text-teal-600 font-semibold underline">
                    Privacy Policy
                  </Link>{' '}
                  (under the Digital Personal Data Protection Act, 2023).
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>{submitting ? 'Creating Institute Tenant...' : 'Complete Institute Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* DPDP Section 9 Trust Notice */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center space-x-1.5 text-teal-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>DPDP Act 2023 Section 9 VPC</span>
            </span>
            <span>24-Hour PyJWT Encrypted Session</span>
          </div>
        </div>

        {/* Quick Footer Links */}
        <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-teal-600 transition">Homepage</Link>
          <span>•</span>
          <Link href="/privacy-policy" className="hover:text-teal-600 transition">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-teal-600 transition">Terms of Service</Link>
          <span>•</span>
          <Link href="/login" className="hover:text-teal-600 transition">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
