"use client"

import { motion, useInView } from 'framer-motion';
import Image from "next/image";
import { useRef } from 'react';

interface AboutContent {
    title: string;
    paragraphs: string[];
    image: {
        src: string;
        alt: string;
    };
}

interface AboutProps {
    content: AboutContent;
}

const About = ({ content }: AboutProps) => {
    const aboutRef = useRef(null);
    const isAboutInView = useInView(aboutRef, { once: true });

    return (
        (<motion.section
            ref={aboutRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4"
            initial={{ opacity: 0, x: 100 }}
            animate={isAboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
        >
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">{content.title}</h2>
                {content.paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-gray-700">
                        {paragraph}
                    </p>
                ))}
            </div>
            <div className="flex justify-center items-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                    <Image
                        src={content.image.src}
                        alt={content.image.alt}
                        className="rounded-full shadow-xl"
                        priority
                        fill
                        sizes="100vw"
                        style={{
                            objectFit: "cover"
                        }} />
                </div>
            </div>
        </motion.section>)
    );
};

export default About;
