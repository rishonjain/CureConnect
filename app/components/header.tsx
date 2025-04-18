"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X, Sun, Moon, Video, UserRound } from "lucide-react"
import { useTheme } from "next-themes"

const navItems = [
  { name: "Home", href: "/" },
  { name: "CureBot", href: "/ai-assistant" },
  { name: "Video Consultations", href: "/video-conference" },
  { name: "Doctors", href: "/doctors", icon: UserRound },
  { name: "Contact", href: "#contact" },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white dark:bg-gray-900 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-teal-600 dark:text-teal-400">
          CureConnect
        </Link>
        <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center"
            >
              {item.icon && <item.icon className="w-4 h-4 mr-1" />}
              {item.name === "Video Consultations" && <Video className="w-4 h-4 mr-1" />}
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
          <button
            className="md:hidden text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
        >
          <nav className="flex flex-col py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900 hover:text-teal-600 dark:hover:text-teal-400 transition-colors flex items-center"
                onClick={() => setIsOpen(false)}
              >
                {item.icon && <item.icon className="w-4 h-4 mr-1" />}
                {item.name === "Video Consultations" && <Video className="w-4 h-4 mr-1" />}
                {item.name}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  )
}
