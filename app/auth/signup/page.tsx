"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2, Check } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/auth"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { theme } = useTheme()

  // Password strength indicators
  const hasMinLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

  const passwordStrength = [hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length

  const getPasswordStrengthLabel = () => {
    if (passwordStrength <= 2) return "Weak"
    if (passwordStrength <= 4) return "Medium"
    return "Strong"
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500"
    if (passwordStrength <= 4) return "bg-yellow-500"
    return "bg-green-500"
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password strength
    if (passwordStrength < 3) {
      setError("Please use a stronger password")
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would make an API call to your registration endpoint
      const result = await createUser(name, email, password)

      if (result.success) {
        // Redirect to login page after successful signup
        router.push("/auth/login?registered=true")
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

  const handleGoogleSignup = async () => {
    setError("")
    setIsLoading(true)

    try {
      // In a real app, this would initiate OAuth flow with Google
      // For this demo, we'll simulate a successful signup after a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))
      router.push("/")
    } catch (err) {
      setError("Google authentication failed. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-sky-400 to-purple-500 dark:from-slate-900 dark:to-purple-900 flex flex-col items-center p-4 text-white">
      <header className="w-full max-w-md mb-6 flex items-center">
        <Link href="/settings">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white/20 dark:bg-slate-800/40 backdrop-blur-md mr-3"
            aria-label="Go back to settings"
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
          Create Account
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

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-5 w-5 text-white/70" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full py-3 pl-10 pr-3 rounded-xl bg-white/10 dark:bg-slate-700/20 placeholder-white/60 text-white border-0 focus:ring-2 focus:ring-white/30 transition-all duration-300"
                  placeholder="John Doe"
                />
              </div>
            </div>

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

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-white/70" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full py-3 pl-10 pr-10 rounded-xl bg-white/10 dark:bg-slate-700/20 placeholder-white/60 text-white border-0 focus:ring-2 focus:ring-white/30 transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Password strength: {getPasswordStrengthLabel()}</span>
                    <span className="text-xs">{passwordStrength}/5</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <ul className="space-y-1 text-xs">
                    <PasswordRequirement met={hasMinLength} text="At least 8 characters" />
                    <PasswordRequirement met={hasUpperCase} text="At least one uppercase letter" />
                    <PasswordRequirement met={hasLowerCase} text="At least one lowercase letter" />
                    <PasswordRequirement met={hasNumber} text="At least one number" />
                    <PasswordRequirement met={hasSpecialChar} text="At least one special character" />
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-white/70" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full py-3 pl-10 pr-3 rounded-xl bg-white/10 dark:bg-slate-700/20 placeholder-white/60 text-white border-0 focus:ring-2 focus:ring-white/30 transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-300 mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 dark:bg-slate-700/40 dark:hover:bg-slate-700/50 font-medium transition-all duration-300 flex justify-center items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center">
            <div className="flex-grow h-px bg-white/20"></div>
            <span className="px-3 text-sm text-white/70">or</span>
            <div className="flex-grow h-px bg-white/20"></div>
          </div>

          <button
            onClick={handleGoogleSignup}
            disabled={isLoading}
            className="mt-6 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-slate-700/30 dark:hover:bg-slate-700/40 font-medium transition-all duration-300 flex justify-center items-center"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <GoogleIcon className="h-5 w-5 mr-2" />
                Sign up with Google
              </>
            )}
          </button>

          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

// Password requirement component
function PasswordRequirement({ met, text }) {
  return (
    <li className="flex items-center">
      {met ? (
        <Check className="h-3.5 w-3.5 mr-2 text-green-400" />
      ) : (
        <div className="h-3.5 w-3.5 mr-2 rounded-full border border-white/30" />
      )}
      <span className={met ? "text-white" : "text-white/50"}>{text}</span>
    </li>
  )
}

// Google icon component
function GoogleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

