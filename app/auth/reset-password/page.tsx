"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Mail, AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { resetPassword } from "@/lib/auth"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { theme } = useTheme()

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    try {
      // In a real app, this would make an API call to your password reset endpoint
      const result = await resetPassword(email)

      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-sky-400 to-purple-500 dark:from-slate-900 dark:to-purple-900 flex flex-col items-center p-4 text-white">
      <header className="w-full max-w-md mb-6 flex items-center">
        <Link href="/auth/login">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white/20 dark:bg-slate-800/40 backdrop-blur-md mr-3"
            aria-label="Go back to login"
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.div>
        </Link>
        <motion.h1
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Reset Password
        </motion.h1>
      </header>

      <motion.div
        className="w-full max-w-md rounded-3xl overflow-hidden bg-white/20 dark:bg-slate-800/30 backdrop-blur-md shadow-lg transition-colors duration-300 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          {error && (
            <motion.div
              className="mb-6 p-3 rounded-lg bg-red-500/20 border border-red-500/30 flex items-start"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </motion.div>
          )}

          {success ? (
            <motion.div
              className="py-8 flex flex-col items-center text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle className="h-16 w-16 text-green-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Check your email</h2>
              <p className="mb-6">
                We've sent password reset instructions to <span className="font-medium">{email}</span>
              </p>
              <p className="text-sm text-white/70">
                Didn't receive the email? Check your spam folder or{" "}
                <button onClick={handleResetPassword} className="text-white underline hover:text-white/90">
                  try again
                </button>
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <p className="mb-4">Enter your email address and we'll send you instructions to reset your password.</p>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-5 w-5 text-white/70" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full py-3 pl-10 pr-3 rounded-xl bg-white/10 dark:bg-slate-700/20 placeholder-white/60 text-white border-0 focus:ring-2 focus:ring-white/30 transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 dark:bg-slate-700/40 dark:hover:bg-slate-700/50 font-medium transition-all duration-300 flex justify-center items-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Instructions"
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
    </div>
  )
}

