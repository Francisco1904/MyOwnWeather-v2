'use client';

import { useState, FormEvent, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { theme } = useTheme();
  const { requestPasswordReset } = useAuth();

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const result = await requestPasswordReset(email);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for the "try again" button click inside the success state
  const handleTryAgain = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const result = await requestPasswordReset(email);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="section-header">
        <Link href="/auth/login">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="back-button"
            aria-label="Go back to login"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.div>
        </Link>
        <motion.h1
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Reset Password
        </motion.h1>
      </header>

      <motion.div
        className="content-card mb-6 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          {error && (
            <motion.div
              className="mb-6 flex items-start rounded-lg border border-red-500/30 bg-red-500/20 p-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          {success ? (
            <motion.div
              className="flex flex-col items-center py-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle className="mb-4 h-16 w-16 text-green-400" />
              <h2 className="mb-2 text-xl font-semibold">Check your email</h2>
              <p className="mb-6">
                We've sent password reset instructions to{' '}
                <span className="font-medium">{email}</span>
              </p>
              <p className="text-sm text-white/70">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={handleTryAgain}
                  className="text-white underline hover:text-white/90"
                >
                  try again
                </button>
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <p className="mb-4">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-white/70" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border-0 bg-white/10 py-3 pl-10 pr-3 text-white placeholder-white/60 transition-all duration-300 focus:ring-2 focus:ring-white/30 dark:bg-slate-700/20"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-xl bg-white/20 py-3 font-medium transition-all duration-300 hover:bg-white/30 dark:bg-slate-700/40 dark:hover:bg-slate-700/50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
}
