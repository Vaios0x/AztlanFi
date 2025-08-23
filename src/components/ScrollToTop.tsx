'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              scrollToTop()
            }
          }}
          className="fixed bottom-8 left-8 z-50 w-12 h-12 bg-gradient-to-r from-monad-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-monad-500 focus:ring-offset-2"
          aria-label="Back to top of page"
          tabIndex={0}
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
