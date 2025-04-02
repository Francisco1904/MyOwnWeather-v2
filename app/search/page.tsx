"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, SearchIcon, MapPin, X, Loader2, Clock } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"

// Mock data for recent searches and search results
const recentSearches = [
  { id: 1, name: "London, UK" },
  { id: 2, name: "New York, USA" },
  { id: 3, name: "Tokyo, Japan" },
]

const mockSearchResults = [
  { id: 1, name: "Lisbon", country: "Portugal", temp: 19, condition: "Partly Cloudy" },
  { id: 2, name: "London", country: "United Kingdom", temp: 12, condition: "Rainy" },
  { id: 3, name: "Los Angeles", country: "United States", temp: 24, condition: "Sunny" },
  { id: 4, name: "Lagos", country: "Nigeria", temp: 31, condition: "Clear" },
  { id: 5, name: "Lima", country: "Peru", temp: 22, condition: "Cloudy" },
]

export default function SearchPage() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [showRecent, setShowRecent] = useState(true)
  const inputRef = useRef(null)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    // Show recent searches when query is empty
    if (searchQuery === "") {
      setShowRecent(true)
      setSearchResults([])
      return
    }

    // Hide recent searches when typing
    setShowRecent(false)

    // Simulate search with loading state
    const performSearch = async () => {
      setIsSearching(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Filter mock results based on query
      const filteredResults = mockSearchResults.filter(
        (location) =>
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.country.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      setSearchResults(filteredResults)
      setIsSearching(false)
    }

    // Debounce search to avoid too many requests
    const debounceTimer = setTimeout(() => {
      performSearch()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleClearSearch = () => {
    setSearchQuery("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-sky-400 to-purple-500 dark:from-slate-900 dark:to-purple-900 flex flex-col items-center p-4 text-white pb-20">
      <header className="w-full max-w-md mb-6 flex items-center">
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
          Search Locations
        </motion.h1>
      </header>

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search Input */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <SearchIcon className="h-5 w-5 text-white/70" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="w-full py-3 pl-12 pr-12 rounded-xl bg-white/20 dark:bg-slate-800/30 backdrop-blur-md placeholder-white/60 text-white border-0 focus:ring-2 focus:ring-white/30 transition-all duration-300"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search for a city"
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-4"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <X className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
            </button>
          )}
        </div>

        {/* Search Results or Recent Searches */}
        <div className="rounded-3xl overflow-hidden bg-white/20 dark:bg-slate-800/30 backdrop-blur-md shadow-lg transition-colors duration-300">
          <div className="p-6">
            <AnimatePresence mode="wait">
              {isSearching ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-white/70 mb-4" />
                  <p className="text-white/70">Searching for locations...</p>
                </motion.div>
              ) : showRecent ? (
                <motion.div key="recent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Recent Searches
                  </h2>
                  {recentSearches.length > 0 ? (
                    <ul className="space-y-2">
                      {recentSearches.map((location) => (
                        <RecentSearchItem key={location.id} location={location} />
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white/70 text-center py-4">No recent searches</p>
                  )}
                </motion.div>
              ) : searchResults.length > 0 ? (
                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-lg font-semibold mb-4">Search Results</h2>
                  <ul className="space-y-3">
                    {searchResults.map((location) => (
                      <SearchResultItem key={location.id} location={location} />
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <p className="text-white/70 mb-2">No locations found for "{searchQuery}"</p>
                  <p className="text-white/50 text-sm text-center">
                    Try searching for a city name or check the spelling
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Bottom Navigation */}
      <BottomNav activePage="search" />
    </div>
  )
}

function RecentSearchItem({ location }) {
  return (
    <motion.li whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link href="/" className="block">
        <div className="flex items-center p-3 rounded-xl bg-white/10 dark:bg-slate-700/20 hover:bg-white/15 dark:hover:bg-slate-700/30 transition-colors duration-200">
          <Clock className="h-5 w-5 mr-3 text-white/70" />
          <span>{location.name}</span>
        </div>
      </Link>
    </motion.li>
  )
}

function SearchResultItem({ location }) {
  return (
    <motion.li whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link href="/" className="block">
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/10 dark:bg-slate-700/20 hover:bg-white/15 dark:hover:bg-slate-700/30 transition-colors duration-200">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-3 text-white/70" />
            <div>
              <div className="font-medium">{location.name}</div>
              <div className="text-sm text-white/70">{location.country}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">{location.temp}°</div>
            <div className="text-sm text-white/70">{location.condition}</div>
          </div>
        </div>
      </Link>
    </motion.li>
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
      <NavItem href="/search" icon={<SearchIcon />} label="Search" active={activePage === "search"} />
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
import { Home, BarChart2, Settings } from "lucide-react"

