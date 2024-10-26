"use client"

import { Parallax } from 'react-parallax';
import Image from "next/legacy/image";

const designWorks = [
  {
    id: 1,
    title: "Minimalist Logo Design",
    description: "A clean and modern logo design for a tech startup.",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
  },
  {
    id: 2,
    title: "Vibrant Poster Series",
    description: "A series of colorful posters for a music festival.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2064&q=80"
  },
  {
    id: 3,
    title: "UI/UX Design for Mobile App",
    description: "A sleek and intuitive user interface design for a fitness tracking app.",
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80"
  },
  {
    id: 4,
    title: "Brand Identity Package",
    description: "A comprehensive brand identity design for a luxury hotel chain.",
    image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  }
];

export default function Design() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center">Design Portfolio</h1>
      <p className="text-xl text-gray-600 mb-12 text-center">Explore my diverse range of design projects, from branding to user interfaces.</p>
      
      {designWorks.map((work, index) => (
        <Parallax
          key={work.id}
          blur={{ min: -15, max: 15 }}
          bgImage={work.image}
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