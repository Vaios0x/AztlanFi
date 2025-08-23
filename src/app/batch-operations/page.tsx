'use client';

import BatchOperationsDemo from '@/components/BatchOperationsDemo';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Home, ChevronRight, Zap } from 'lucide-react';

export default function BatchOperationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Header />
      
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b border-gray-100 py-4"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <a 
              href="/" 
              className="flex items-center gap-1 hover:text-purple-600 transition-colors"
              aria-label="Go to home page"
            >
              <Home size={16} />
              Home
            </a>
            <ChevronRight size={16} />
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-gray-900 font-medium">Batch Operations</span>
            </div>
          </nav>
        </div>
      </motion.div>

      <main>
        <BatchOperationsDemo />
      </main>
      
      <Footer />
    </div>
  );
}
