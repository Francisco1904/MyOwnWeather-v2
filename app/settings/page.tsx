"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Moon, Sun, Home, BarChart2, Search, Settings, LogOut, User, UserPlus, LogIn } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { getCurrentUser, logoutUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Get current user on component mount
    setCurrentUser(getCurrentUser())
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

  const handleLogout = () => {
    logoutUser()
    setCurrentUser(null)
    // Optionally redirect to home page
    router.push("/")
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-sky-400 to-purple-500 dark:from-slate-900 dark:to-purple-900 flex flex-col items-center p-4 text-white">
      <div className="w-full max-w-md">
        <header className="flex items-center mb-6">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-white/20 dark:bg-slate-800/40 backdrop-blur-md mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.div>
          </Link>
          <h1 className="text-2xl font-bold">Settings</h1>
        </header>

        {/* Account Section */}
        <motion.div
          className="w-full rounded-3xl overflow-hidden bg-white/20 dark:bg-slate-800/30 backdrop-blur-md shadow-lg transition-colors duration-300 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Account</h2>

            {currentUser ? (
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-white/20 dark:bg-slate-700/40 flex items-center justify-center mr-4">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-sm text-white/70">{currentUser.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-slate-700/30 dark:hover:bg-slate-700/40 font-medium transition-all duration-300 flex justify-center items-center"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Log Out
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-white/80 mb-4">
                  Sign in to save your preferences and access your weather data across devices.
                </p>

                <Link href="/auth/login" className="w-full">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 dark:bg-slate-700/40 dark:hover:bg-slate-700/50 font-medium transition-all duration-300 flex justify-center items-center"
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Log In
                  </motion.button>
                </Link>

                <Link href="/auth/signup" className="w-full">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-slate-700/30 dark:hover:bg-slate-700/40 font-medium transition-all duration-300 flex justify-center items-center"
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Create Account
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Appearance Section */}
        <motion.div
          className="w-full rounded-3xl overflow-hidden bg-white/20 dark:bg-slate-800/30 backdrop-blur-md shadow-lg transition-colors duration-300 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Appearance</h2>

            <div className="space-y-6">
              {/* Theme Toggle */}
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Dark Mode</Label>
                    <p className="text-sm opacity-80">Switch between light and dark themes</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 text-yellow-300 dark:text-yellow-200" />
                    <Switch
                      checked={isDark}
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                      className="data-[state=checked]:bg-slate-700"
                    />
                    <Moon className="h-4 w-4" />
                  </div>
                </div>

                {/* Theme Preview */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTheme("light")}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      !isDark ? "border-white ring-2 ring-white/50" : "border-transparent"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-purple-500 opacity-90"></div>
                    <div className="relative p-3">
                      <div className="rounded-lg bg-white/20 backdrop-blur-sm p-2 mb-2">
                        <div className="h-3 w-16 bg-white/60 rounded-full mb-1"></div>
                        <div className="h-3 w-10 bg-white/60 rounded-full"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-6 w-6 rounded-full bg-white/30"></div>
                        <div className="h-6 w-10 rounded-lg bg-white/30"></div>
                      </div>
                      <div className="mt-2 text-xs text-center font-medium">Light</div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTheme("dark")}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      isDark ? "border-white ring-2 ring-white/50" : "border-transparent"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-purple-900 opacity-90"></div>
                    <div className="relative p-3">
                      <div className="rounded-lg bg-slate-800/40 backdrop-blur-sm p-2 mb-2">
                        <div className="h-3 w-16 bg-white/40 rounded-full mb-1"></div>
                        <div className="h-3 w-10 bg-white/40 rounded-full"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-6 w-6 rounded-full bg-slate-700/50"></div>
                        <div className="h-6 w-10 rounded-lg bg-slate-700/50"></div>
                      </div>
                      <div className="mt-2 text-xs text-center font-medium">Dark</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preferences Section */}
        <motion.div
          className="w-full rounded-3xl overflow-hidden bg-white/20 dark:bg-slate-800/30 backdrop-blur-md shadow-lg transition-colors duration-300 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Preferences</h2>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Temperature Unit</Label>
                  <p className="text-sm opacity-80">Choose between Celsius and Fahrenheit</p>
                </div>
                <Switch defaultChecked={true} />
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Notifications</Label>
                    <p className="text-sm opacity-80">Receive weather alerts and updates</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activePage="settings" />
    </div>
  )
}

function BottomNav({ activePage }) {
  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 bg-white/20 dark:bg-slate-800/30 backdrop-blur-md p-4 flex justify-around items-center transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavItem href="/" icon={<Home />} label="Home" active={activePage === "home"} />
      <NavItem href="/details" icon={<BarChart2 />} label="Details" active={activePage === "details"} />
      <NavItem href="/search" icon={<Search />} label="Search" active={activePage === "search"} />
      <NavItem href="/settings" icon={<Settings />} label="Settings" active={activePage === "settings"} />
    </motion.nav>
  )
}

function NavItem({ href, icon, label, active = false }) {
  return (
    <Link href={href}>
      <motion.div className="flex flex-col items-center" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <div
          className={`p-2 rounded-full transition-colors duration-300 ${
            active ? "bg-white/30 dark:bg-slate-700/40" : "text-white/70"
          }`}
        >
          {icon}
        </div>
        <span className={`text-xs mt-1 ${active ? "opacity-100" : "opacity-70"}`}>{label}</span>
      </motion.div>
    </Link>
  )
}

