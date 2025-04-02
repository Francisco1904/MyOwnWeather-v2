"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Sun,
  Thermometer,
  Umbrella,
  Wind,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import Link from "next/link"

// Mock data for our detailed forecasts
const hourlyForecast = [
  { time: "Now", temp: 19, icon: <CloudSun />, precipitation: 0 },
  { time: "13:00", temp: 20, icon: <CloudSun />, precipitation: 0 },
  { time: "14:00", temp: 21, icon: <Sun />, precipitation: 0 },
  { time: "15:00", temp: 21, icon: <Sun />, precipitation: 0 },
  { time: "16:00", temp: 20, icon: <CloudSun />, precipitation: 0 },
  { time: "17:00", temp: 19, icon: <Cloud />, precipitation: 10 },
  { time: "18:00", temp: 18, icon: <CloudRain />, precipitation: 30 },
  { time: "19:00", temp: 17, icon: <CloudRain />, precipitation: 40 },
  { time: "20:00", temp: 16, icon: <Cloud />, precipitation: 20 },
  { time: "21:00", temp: 15, icon: <Cloud />, precipitation: 10 },
  { time: "22:00", temp: 15, icon: <Cloud />, precipitation: 0 },
  { time: "23:00", temp: 14, icon: <Cloud />, precipitation: 0 },
]

const dailyForecast = [
  {
    day: "Today",
    date: "Apr 1",
    high: 21,
    low: 14,
    icon: <CloudSun />,
    precipitation: 30,
    wind: 17,
    humidity: 68,
    sunrise: "06:42",
    sunset: "19:54",
    description: "Partly cloudy with a chance of rain in the evening",
  },
  {
    day: "Wed",
    date: "Apr 2",
    high: 22,
    low: 15,
    icon: <Sun />,
    precipitation: 0,
    wind: 12,
    humidity: 55,
    sunrise: "06:40",
    sunset: "19:55",
    description: "Clear skies throughout the day",
  },
  {
    day: "Thu",
    date: "Apr 3",
    high: 23,
    low: 16,
    icon: <Sun />,
    precipitation: 0,
    wind: 10,
    humidity: 50,
    sunrise: "06:39",
    sunset: "19:56",
    description: "Sunny and warm",
  },
  {
    day: "Fri",
    date: "Apr 4",
    high: 20,
    low: 15,
    icon: <CloudRain />,
    precipitation: 60,
    wind: 20,
    humidity: 75,
    sunrise: "06:37",
    sunset: "19:57",
    description: "Rain throughout the day",
  },
  {
    day: "Sat",
    date: "Apr 5",
    high: 18,
    low: 13,
    icon: <CloudRain />,
    precipitation: 70,
    wind: 25,
    humidity: 80,
    sunrise: "06:36",
    sunset: "19:58",
    description: "Heavy rain and windy",
  },
  {
    day: "Sun",
    date: "Apr 6",
    high: 19,
    low: 14,
    icon: <Cloud />,
    precipitation: 20,
    wind: 15,
    humidity: 65,
    sunrise: "06:34",
    sunset: "19:59",
    description: "Cloudy with occasional sun",
  },
  {
    day: "Mon",
    date: "Apr 7",
    high: 21,
    low: 15,
    icon: <CloudSun />,
    precipitation: 10,
    wind: 12,
    humidity: 60,
    sunrise: "06:33",
    sunset: "20:00",
    description: "Mostly sunny with some clouds",
  },
]

const detailedMetrics = {
  humidity: 68,
  dewPoint: 13,
  uvIndex: 5,
  visibility: 16,
  pressure: 1015,
  feelsLike: 19,
}

export default function DetailedForecast() {
  const [mounted, setMounted] = useState(false)
  const [expandedDay, setExpandedDay] = useState<number | null>(null)
  const router = useRouter()
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = theme === "dark"

  const toggleDayExpansion = (index: number) => {
    if (expandedDay === index) {
      setExpandedDay(null)
    } else {
      setExpandedDay(index)
    }
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-sky-400 to-purple-500 dark:from-slate-900 dark:to-purple-900 flex flex-col items-center p-4 text-white pb-20">
      <header className="w-full max-w-md mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-white/20 dark:bg-slate-800/40 backdrop-blur-md mr-3"
              aria-label="Go back to home"
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
            Detailed Forecast
          </motion.h1>
        </div>
      </header>

      <motion.div
        className="w-full max-w-md rounded-3xl overflow-hidden bg-white/20 dark:bg-slate-800/30 backdrop-blur-md shadow-lg transition-colors duration-300 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">Lisboa, Portugal</h2>
              <p className="text-sm opacity-90">Tuesday, 1 Apr</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">19°</p>
              <p className="text-sm">Partly Cloudy</p>
            </div>
          </div>

          <div className="flex justify-between text-sm mb-2">
            <span>Hourly Forecast</span>
          </div>

          <div className="overflow-x-auto pb-2 -mx-2 px-2">
            <div className="flex space-x-3 min-w-max">
              {hourlyForecast.map((hour, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  className="flex flex-col items-center bg-white/10 dark:bg-slate-700/20 rounded-xl p-3 min-w-[70px]"
                >
                  <span className="text-xs">{hour.time}</span>
                  <div className="my-1">{hour.icon}</div>
                  <span className="font-medium">{hour.temp}°</span>
                  <div className="flex items-center mt-1">
                    <Umbrella className="h-3 w-3 mr-1" />
                    <span className="text-xs">{hour.precipitation}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="w-full max-w-md rounded-3xl overflow-hidden bg-white/20 dark:bg-slate-800/30 backdrop-blur-md shadow-lg transition-colors duration-300 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="p-6">
          <div className="flex justify-between text-sm mb-4">
            <span>7-Day Forecast</span>
          </div>

          <div className="space-y-2">
            {dailyForecast.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
              >
                <div
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors",
                    expandedDay === index
                      ? "bg-white/20 dark:bg-slate-700/30"
                      : "bg-white/10 dark:bg-slate-700/20 hover:bg-white/15 dark:hover:bg-slate-700/25",
                  )}
                  onClick={() => toggleDayExpansion(index)}
                >
                  <div className="flex items-center">
                    <div className="w-10">{day.icon}</div>
                    <div className="ml-2">
                      <div className="font-medium">{day.day}</div>
                      <div className="text-xs opacity-80">{day.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-3">
                      <span className="text-sm font-medium">{day.high}°</span>
                      <span className="text-sm text-white/70 ml-2">{day.low}°</span>
                    </div>
                    {expandedDay === index ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </div>

                {expandedDay === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/10 dark:bg-slate-700/20 p-4 rounded-xl mt-1"
                  >
                    <p className="text-sm mb-3">{day.description}</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center">
                        <Umbrella className="h-4 w-4 mr-2" />
                        <div>
                          <div className="text-xs opacity-80">Precipitation</div>
                          <div className="text-sm font-medium">{day.precipitation}%</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Wind className="h-4 w-4 mr-2" />
                        <div>
                          <div className="text-xs opacity-80">Wind</div>
                          <div className="text-sm font-medium">{day.wind} km/h</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Droplets className="h-4 w-4 mr-2" />
                        <div>
                          <div className="text-xs opacity-80">Humidity</div>
                          <div className="text-sm font-medium">{day.humidity}%</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Sun className="h-4 w-4 mr-2" />
                        <div>
                          <div className="text-xs opacity-80">Sunrise/Sunset</div>
                          <div className="text-sm font-medium">
                            {day.sunrise}/{day.sunset}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="w-full max-w-md rounded-3xl overflow-hidden bg-white/20 dark:bg-slate-800/30 backdrop-blur-md shadow-lg transition-colors duration-300 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="p-6">
          <div className="flex justify-between text-sm mb-4">
            <span>Today's Details</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              className="bg-white/10 dark:bg-slate-700/20 p-3 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex items-center mb-2">
                <Droplets className="h-4 w-4 mr-2" />
                <span className="text-sm">Humidity</span>
              </div>
              <div className="text-xl font-medium">{detailedMetrics.humidity}%</div>
              <div className="w-full bg-white/20 dark:bg-slate-600/30 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-blue-400 dark:bg-blue-500 h-full rounded-full"
                  style={{ width: `${detailedMetrics.humidity}%` }}
                ></div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/10 dark:bg-slate-700/20 p-3 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              <div className="flex items-center mb-2">
                <Thermometer className="h-4 w-4 mr-2" />
                <span className="text-sm">Feels Like</span>
              </div>
              <div className="text-xl font-medium">{detailedMetrics.feelsLike}°C</div>
              <div className="text-xs opacity-70 mt-2">Similar to the actual temperature</div>
            </motion.div>

            <motion.div
              className="bg-white/10 dark:bg-slate-700/20 p-3 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="flex items-center mb-2">
                <Wind className="h-4 w-4 mr-2" />
                <span className="text-sm">Wind</span>
              </div>
              <div className="text-xl font-medium">17 km/h</div>
              <div className="text-xs opacity-70 mt-2">Westerly wind</div>
            </motion.div>

            <motion.div
              className="bg-white/10 dark:bg-slate-700/20 p-3 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.45 }}
            >
              <div className="flex items-center mb-2">
                <Umbrella className="h-4 w-4 mr-2" />
                <span className="text-sm">Precipitation</span>
              </div>
              <div className="text-xl font-medium">30%</div>
              <div className="text-xs opacity-70 mt-2">Chance of rain tonight</div>
            </motion.div>

            <motion.div
              className="bg-white/10 dark:bg-slate-700/20 p-3 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <div className="flex items-center mb-2">
                <Sun className="h-4 w-4 mr-2" />
                <span className="text-sm">UV Index</span>
              </div>
              <div className="text-xl font-medium">{detailedMetrics.uvIndex} (Moderate)</div>
              <div className="w-full bg-white/20 dark:bg-slate-600/30 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-yellow-400 dark:bg-yellow-500 h-full rounded-full"
                  style={{ width: `${(detailedMetrics.uvIndex / 10) * 100}%` }}
                ></div>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/10 dark:bg-slate-700/20 p-3 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.55 }}
            >
              <div className="flex items-center mb-2">
                <Cloud className="h-4 w-4 mr-2" />
                <span className="text-sm">Pressure</span>
              </div>
              <div className="text-xl font-medium">{detailedMetrics.pressure} hPa</div>
              <div className="text-xs opacity-70 mt-2">Normal</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Navigation */}
      <BottomNav activePage="details" />
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

// Import icons
import { Home, BarChart2, Search, Settings } from "lucide-react"

