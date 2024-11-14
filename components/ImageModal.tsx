"use client"

import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";
import { X } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
}

export default function ImageModal({ isOpen, onClose, src, alt }: ImageModalProps) {
  if (!isOpen) return null;

  return (
    (<AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/90 backdrop-blur-sm">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
          aria-label="Close modal"
        >
          <X size={32} />
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full h-full flex items-center justify-center p-4"
        >
          <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              style={{
                maxWidth: "100%"
              }} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>)
  );
}
