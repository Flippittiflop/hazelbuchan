"use client"

import Image from 'next/image';
import { motion } from 'framer-motion';

interface HeroProps {
    backgroundImage: {
        src: string;
        alt: string;
    };
    content: {
        heading: string;
        subheading: string;
        cta: {
            text: string;
            href: string;
        };
    };
}

export default function Hero({ backgroundImage, content }: HeroProps) {
    return (
        <div className="relative h-[70vh]">
            <div className="absolute inset-0">
                <Image
                    src={backgroundImage.src}
                    alt={backgroundImage.alt}
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50" />
            </div>

            <div className="relative h-full flex items-center justify-center text-white text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        {content.heading}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8">
                        {content.subheading}
                    </p>
                    <a
                        href={content.cta.href}
                        className="inline-block bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all transform hover:scale-105"
                    >
                        {content.cta.text}
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
