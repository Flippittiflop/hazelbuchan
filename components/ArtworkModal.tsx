"use client"

import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { motion, AnimatePresence, useAnimation, PanInfo } from 'framer-motion';

interface ArtworkModalProps {
  artwork: {
    src: string;
    alt: string;
    title: string;
    date: string;
    description: string;
  };
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({
                                                     artwork,
                                                     onClose,
                                                     onNext,
                                                     onPrevious,
                                                     hasNext,
                                                     hasPrevious
                                                   }) => {
  const controls = useAnimation();

  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          if (hasNext) onNext();
          break;
        case 'ArrowLeft':
          if (hasPrevious) onPrevious();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyboard);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrevious, hasNext, hasPrevious]);

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold && hasPrevious) {
      await controls.start({ x: 200, opacity: 0 });
      onPrevious();
    } else if (info.offset.x < -threshold && hasNext) {
      await controls.start({ x: -200, opacity: 0 });
      onNext();
    }
    controls.start({ x: 0, opacity: 1 });
  };

  return (
      <div
          className="fixed inset-0 bg-black z-50 overflow-hidden"
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
      >
        <div className="h-full w-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-black bg-opacity-75">
            <div>
              <h2 id="modal-title" className="text-2xl font-bold text-white">{artwork.title}</h2>
              <p className="text-gray-300" data-testid="modal-header-date">{artwork.date}</p>
            </div>
            <button
                onClick={onClose}
                className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10"
                aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-auto">
            <div className="h-full flex flex-col lg:flex-row">
              {/* Image container */}
              <div className="relative flex-1 min-h-[50vh] lg:min-h-full">
                <motion.div
                    className="h-full"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                    animate={controls}
                    initial={{ x: 0, opacity: 1 }}
                >
                  <Image
                      src={artwork.src}
                      alt={artwork.alt}
                      className="select-none"
                      priority
                      fill
                      sizes="100vw"
                      style={{
                        objectFit: "contain",
                        maxWidth: "100%"
                      }}
                  />
                </motion.div>

                {/* Navigation buttons */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                  {hasPrevious && (
                      <button
                          onClick={onPrevious}
                          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
                          aria-label="Previous image"
                      >
                        <ChevronLeft size={24} />
                      </button>
                  )}
                  {hasNext && (
                      <button
                          onClick={onNext}
                          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
                          aria-label="Next image"
                      >
                        <ChevronRight size={24} />
                      </button>
                  )}
                </div>
              </div>

              {/* Description panel */}
              <div className="lg:w-96 bg-white p-6 lg:h-full lg:overflow-auto">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-2">About this piece</h3>
                  <p className="text-gray-700">{artwork.description}</p>

                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Year</h4>
                      <p className="text-gray-600" data-testid="modal-details-date">{artwork.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ArtworkModal;
