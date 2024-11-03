"use client"

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

interface FeaturedWork {
    id: number;
    src: string;
    alt: string;
    title: string;
    category: string;
    date: string;
    description: string;
}

interface FeaturedWorksProps {
    items: FeaturedWork[];
}

const FeaturedWorks = ({ items }: FeaturedWorksProps) => {
    const worksRef = useRef(null);
    const isWorksInView = useInView(worksRef, { once: true, margin: "-100px" });

    return (
        <section ref={worksRef} id="featured-works" className="py-4 space-y-4">
            <div className="container mx-auto px-4">
                <motion.h2
                    className="text-2xl font-semibold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                >
                    Featured Works
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                    {items.map((work, index) => (
                        <motion.div
                            key={work.id}
                            className="group relative aspect-[3/2] overflow-hidden rounded-lg shadow-lg"
                            initial={{ opacity: 0, y: 50 }}
                            animate={isWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <Image
                                src={work.src}
                                alt={work.alt}
                                layout="fill"
                                objectFit="cover"
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                quality={85}
                                className="transform transition-transform duration-300 group-hover:scale-110"
                                loading={index <= 2 ? "eager" : "lazy"}
                            />
                            {/* Gradient overlay - visible on mobile, hover on desktop */}
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
                          opacity-100 transition-opacity duration-300
                          sm:opacity-0 sm:group-hover:opacity-100"
                            />
                            {/* Content overlay - visible on mobile, hover on desktop */}
                            <div
                                className="absolute bottom-0 left-0 right-0 p-6 text-white
                          transform translate-y-0 transition-transform duration-300
                          sm:translate-y-full sm:group-hover:translate-y-0"
                            >
                                <div className="space-y-2">
                  <span className="inline-block px-2 py-1 text-sm font-medium bg-white/20 rounded-full backdrop-blur-sm">
                    {work.category}
                  </span>
                                    <h3 className="text-xl font-semibold">{work.title}</h3>
                                    <p className="text-sm text-white/90 line-clamp-2">
                                        {work.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedWorks;
