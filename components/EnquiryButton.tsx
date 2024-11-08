"use client"

import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnquiryButtonProps {
  count: number;
  onClick: () => void;
}

export default function EnquiryButton({ count, onClick }: EnquiryButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed top-24 right-4 md:right-8 z-50 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <div className="relative">
        <ShoppingBag size={24} />
        <AnimatePresence>
          {count > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {count}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}