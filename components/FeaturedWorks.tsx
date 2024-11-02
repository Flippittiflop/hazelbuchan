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
    const isWorksInView = useInView(worksRef, { once: true });

    return (
        <section ref={worksRef} className="py-6 space-y-4">
            <div className="container mx-auto px-4">
                <motion.h2
                    className="text-2xl font-semibold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                >
                    Featured Works
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                    {items.map((work, index) => (
                        <motion.div
                            key={work.id}
                            className="group relative h-64 overflow-hidden rounded-lg shadow-lg"
                            initial={{ opacity: 0, y: 50 }}
                            animate={isWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                        >
                            <Image
                                src={work.src}
                                alt={work.alt}
                                layout="fill"
                                objectFit="cover"
                                className="transform transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <div className="bg-black bg-opacity-75 p-4 rounded-lg">
                                    <span className="text-sm font-medium text-blue-400">{work.category}</span>
                                    <h3 className="text-xl font-semibold mt-1">{work.title}</h3>
                                    <p className="text-sm mt-2">{work.description}</p>
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
