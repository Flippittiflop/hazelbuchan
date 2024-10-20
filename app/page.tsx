"use client"

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import VideoHero from '@/components/VideoHero';
import ClientLogos from '@/components/ClientLogos';

export default function Home() {
  const aboutRef = useRef(null);
  const worksRef = useRef(null);
  const isAboutInView = useInView(aboutRef, { once: true });
  const isWorksInView = useInView(worksRef, { once: true });

  return (
    <div className="space-y-8">
      <VideoHero />

      <motion.section 
        ref={aboutRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0, x: 100 }}
        animate={isAboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">About Me</h2>
          <p className="text-gray-700">
            As a versatile artist, I blend traditional techniques with modern approaches to create unique and captivating pieces. My work spans across various disciplines, including graphic design, paper art, and illustration.
          </p>
          <p className="text-gray-700">
            With a keen eye for detail and a passion for storytelling through visuals, I strive to create art that not only pleases the eye but also evokes emotion and sparks imagination.
          </p>
        </div>
        <div className="relative h-64 md:h-auto">
          <Image
            src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
            alt="Artist at work"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      </motion.section>

      <section ref={worksRef} className="space-y-4">
        <h2 className="text-2xl font-semibold">Featured Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i} 
              className="relative h-64"
              initial={{ opacity: 0, y: 50 }}
              animate={isWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
            >
              <Image
                src={`https://picsum.photos/seed/${i}/800/600`}
                alt={`Featured work ${i}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </motion.div>
          ))}
        </div>
      </section>

      <ClientLogos />
    </div>
  );
}