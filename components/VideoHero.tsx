"use client"

import { motion } from 'framer-motion';
import Image from 'next/image';

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
  backgroundImage: BackgroundImage;
  content: HeroContent;
}

const VideoHero = ({ backgroundImage, content }: VideoHeroProps) => {
  return (
      <section
          className="relative h-[70vh] overflow-hidden"
          role="banner"
          aria-label="Welcome section"
      >
        <div className="absolute inset-0">
          <Image
              src={backgroundImage.src}
              alt={backgroundImage.alt}
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
          <div className="text-center text-white px-4">
            <motion.h1
                className="text-4xl md:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
              {content.heading}
            </motion.h1>
            <motion.p
                className="text-xl md:text-2xl max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
              {content.subheading}
            </motion.p>
            <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
              <a
                  href={content.cta.href}
                  className="inline-block bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all transform hover:scale-105"
              >
                {content.cta.text}
              </a>
            </motion.div>
          </div>
        </div>
      </section>
  );
};

export default VideoHero;
