"use client"

import { useState } from 'react';
import Image from "next/image";
import ImageModal from './ImageModal';

interface Product {
  id: string;
  title: string;
  price: string;
  mediaType: "video" | "image";
  src: string;
}

interface ProductGridProps {
  products: Product[];
  onAddToEnquiry: (product: Product) => void;
  selectedProductIds: string[];
}

export default function ProductGrid({ products, onAddToEnquiry, selectedProductIds }: ProductGridProps) {
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  return (<>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div
                className="relative aspect-[2/1] cursor-pointer"
                onClick={() => setSelectedImage({
                  src: product.src,
                  alt: product.title
                })}
            >
              {product.mediaType === 'video' ? (
                  <video
                      src={product.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                  />
              ) : (
                  <Image
                      src={product.src}
                      alt={product.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{
                        maxWidth: "100%"
                      }} />
              )}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
              <p className="text-gray-600 mb-4">Estimated Rental: {product.price}</p>
              <button
                  onClick={() => onAddToEnquiry(product)}
                  disabled={selectedProductIds.includes(product.id)}
                  className={`w-full py-2 px-4 rounded-md transition-colors ${
                      selectedProductIds.includes(product.id)
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                {selectedProductIds.includes(product.id) ? 'Added to Enquiry' : 'Add to Enquiry'}
              </button>
            </div>
          </div>
      ))}
    </div>
    <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        src={selectedImage?.src || ''}
        alt={selectedImage?.alt || ''}
    />
  </>);
}
