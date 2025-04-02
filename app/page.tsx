"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Cloud, CloudSun, Wind, Droplets } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Home, BarChart2, Search, Settings } from "lucide-react"

export default function WeatherApp() {
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
  })

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-sky-400 to-purple-500 dark:from-slate-900 dark:to-purple-900 flex flex-col items-center p-4 text-white">
      <header className="w-full max-w-md mb-6">
        <motion.h1
          className="text-2xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Weather
        </motion.h1>
      </header>

      <motion.div
        className="w-full max-w-md rounded-3xl overflow-hidden bg-white/20 dark:bg-slate-800/30 backdrop-blur-md shadow-lg transition-colors duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold">Lisboa, Portugal</h2>
              <p className="text-sm opacity-90">{formattedDate}</p>
            </div>
            <Link href="/search">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/30 dark:bg-slate-700/40 p-2 rounded-full cursor-pointer transition-colors duration-300"
              >
                <Search className="h-5 w-5" />
              </motion.div>
            </Link>
          </div>

          <div className="flex flex-col items-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                type: "spring",
                stiffness: 100,
              }}
              className="relative mb-2"
            >
              <CloudSun className="h-24 w-24 text-yellow-300 dark:text-yellow-200 stroke-[1.5] transition-colors duration-300" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <h1 className="text-7xl font-bold">19°</h1>
              <p className="text-xl">Partly Cloudy</p>

              <div className="flex justify-center gap-4 mt-2">
                <span className="text-red-300 dark:text-red-400 transition-colors duration-300">Max: 19°</span>
                <span className="text-blue-300 dark:text-blue-400 transition-colors duration-300">Min: 14°</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="grid grid-cols-3 gap-2 bg-white/10 dark:bg-slate-700/20 rounded-2xl p-4 transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 dark:bg-slate-600/40 mb-1 transition-colors duration-300">
                <Droplets className="h-5 w-5" />
              </div>
              <p className="text-sm opacity-80">Humidity</p>
              <p className="font-semibold">68%</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 dark:bg-slate-600/40 mb-1 transition-colors duration-300">
                <Wind className="h-5 w-5" />
              </div>
              <p className="text-sm opacity-80">Wind</p>
              <p className="font-semibold">17 km/h</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 dark:bg-slate-600/40 mb-1 transition-colors duration-300">
                <Cloud className="h-5 w-5" />
              </div>
              <p className="text-sm opacity-80">Feels Like</p>
              <p className="font-semibold">19°</p>
            </div>
          </motion.div>
        </div>

        <Link href="/details">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-white/30 dark:bg-slate-700/30 hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all duration-300 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            View Detailed Forecast
          </motion.button>
        </Link>
      </motion.div>

      {/* Bottom Navigation */}
      <BottomNav activePage="home" />
    </div>
  )
}

function BottomNav({ activePage }) {
  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 bg-white/20 dark:bg-slate-800/30 backdrop-blur-md p-4 flex justify-around items-center transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
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

