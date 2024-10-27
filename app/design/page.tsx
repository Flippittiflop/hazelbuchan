"use client"

import { Parallax } from 'react-parallax';
import galleryData from '@/data/design.json';

export default function Design() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center">Design Portfolio</h1>
      <p className="text-xl text-gray-600 mb-12 text-center">Explore my diverse range of design projects, from branding to user interfaces.</p>
      
      {galleryData.items.map((work, index) => (
        <Parallax
          key={work.id}
          blur={{ min: -15, max: 15 }}
          bgImage={work.src}
          bgImageAlt={work.title}
          strength={200}
        >
          <div className="h-screen flex items-center justify-center">
            <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg max-w-2xl">
              <h2 className="text-3xl font-semibold mb-4">{work.title}</h2>
              <p className="text-lg text-gray-700">{work.description}</p>
            </div>
          </div>
        </Parallax>
      ))}
    </div>
  );
}
