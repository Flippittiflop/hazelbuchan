import Image from 'next/image';
import { X } from 'lucide-react';

interface ArtworkModalProps {
  artwork: {
    src: string;
    alt: string;
    title: string;
    date: string;
    description: string;
  };
  onClose: () => void;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({ artwork, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="relative aspect-square w-full mb-4">
          <Image
            src={artwork.src}
            alt={artwork.alt}
            layout="fill"
            objectFit="contain"
          />
        </div>
        <h2 className="text-2xl font-bold mb-2">{artwork.title}</h2>
        <p className="text-gray-600 mb-2">{artwork.date}</p>
        <p className="text-gray-800">{artwork.description}</p>
      </div>
    </div>
  );
};

export default ArtworkModal;