"use client"

import Image from "next/image";
import { useState, useMemo } from 'react';
import ArtworkModal from './ArtworkModal';
import { event as gaEvent } from '@/lib/analytics';

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  date: string;
  description: string;
}

interface GalleryProps {
  items: GalleryItem[];
}

const Gallery: React.FC<GalleryProps> = ({ items }) => {
  const [selectedArtwork, setSelectedArtwork] = useState<GalleryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const handleArtworkClick = (item: GalleryItem) => {
    setSelectedArtwork(item);
    gaEvent({
      action: 'view_item',
      category: 'Gallery',
      label: item.title,
    });
  };

  const getCurrentIndex = () => {
    if (!selectedArtwork) return -1;
    return filteredItems.findIndex(item => item.id === selectedArtwork.id);
  };

  const handleNext = () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex < filteredItems.length - 1) {
      setSelectedArtwork(filteredItems[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentIndex();
    if (currentIndex > 0) {
      setSelectedArtwork(filteredItems[currentIndex - 1]);
    }
  };

  return (
      <div role="region" aria-label="Gallery">
        <div className="mb-4">
          <label htmlFor="search" className="sr-only">Search gallery</label>
          <input
              type="search"
              id="search"
              placeholder="Search by title or description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search gallery items"
          />
        </div>
        <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
            aria-label="Gallery items"
        >
          {filteredItems.map((item) => (
              <div
                  key={item.id}
                  className="relative aspect-[2/1] overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
                  onClick={() => handleArtworkClick(item)}
                  role="listitem"
                  tabIndex={0}
                  aria-label={`${item.title} - ${item.description}`}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleArtworkClick(item);
                    }
                  }}
              >
                <Image
                    src={item.src}
                    alt={item.alt}
                    className="group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{
                      objectFit: "cover"
                    }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <h3 className="text-white text-center text-lg font-semibold px-4">{item.title}</h3>
                </div>
              </div>
          ))}
        </div>
        {filteredItems.length === 0 && (
            <p className="text-center text-gray-500 mt-4" role="status">
              No items found matching your search.
            </p>
        )}
        {selectedArtwork && (
            <ArtworkModal
                artwork={selectedArtwork}
                onClose={() => setSelectedArtwork(null)}
                onNext={handleNext}
                onPrevious={handlePrevious}
                hasNext={getCurrentIndex() < filteredItems.length - 1}
                hasPrevious={getCurrentIndex() > 0}
            />
        )}
      </div>
  );
};

export default Gallery;
