"use client"

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface HeroContent {
  heading: string;
  subheading: string;
  cta: {
    text: string;
    href: string;
  };
}

interface BackgroundImage {
  src: string;
  alt: string;
  title: string;
}

interface VideoHeroProps {
  backgroundImages: BackgroundImage[];
  content: HeroContent;
}

const VideoHero = ({ backgroundImages, content }: VideoHeroProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simple image rotation every 10 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 10000);

    // Trigger content animation after a short delay
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [backgroundImages.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  // Ensure we have at least one image
  if (backgroundImages.length === 0) {
    return null;
  }

  return (
      <section
          className="relative h-[70vh] overflow-hidden"
          role="banner"
          aria-label="Welcome section"
      >
        <div className="absolute inset-0">
          <Image
              src={backgroundImages[currentImageIndex].src}
              alt={backgroundImages[currentImageIndex].alt}
              layout="fill"
              objectFit="cover"
              priority
              className="transform scale-105"
          />
        </div>
        <div
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            aria-hidden="true"
        >
          <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="text-center text-white px-4"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                  <motion.h1
                      className="text-4xl md:text-6xl font-bold mb-6"
                      variants={itemVariants}
                  >
                    {content.heading}
                  </motion.h1>
                  <motion.p
                      className="text-xl md:text-2xl max-w-2xl mx-auto"
                      variants={itemVariants}
                  >
                    {content.subheading}
                  </motion.p>
                  <motion.div
                      className="mt-8"
                      variants={itemVariants}
                  >
                    <a
                        href={content.cta.href}
                        className="inline-block bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all transform hover:scale-105"
                    >
                      {content.cta.text}
                    </a>
                  </motion.div>
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
  );
};

export default VideoHero;
