import Image from "next/image";
import { X } from 'lucide-react';
import { useEffect } from 'react';

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
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    (<div 
        className="fixed inset-0 bg-black z-50 overflow-hidden"
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
      <div className="h-full w-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-black bg-opacity-75">
          <div>
            <h2 id="modal-title" className="text-2xl font-bold text-white">{artwork.title}</h2>
            <p className="text-gray-300" data-testid="modal-header-date">{artwork.date}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-white/10"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="h-full flex flex-col lg:flex-row">
            {/* Image container */}
            <div className="relative flex-1 min-h-[50vh] lg:min-h-full">
              <Image
                src={artwork.src}
                alt={artwork.alt}
                className="select-none"
                priority
                fill
                sizes="100vw"
                style={{
                  objectFit: "contain",
                  maxWidth: "100%"
                }} />
            </div>

            {/* Description panel */}
            <div className="lg:w-96 bg-white p-6 lg:h-full lg:overflow-auto">
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-2">About this piece</h3>
                <p className="text-gray-700">{artwork.description}</p>
                
                {/* Additional details */}
                <div className="mt-6 space-y-4">
                  {/*<div>*/}
                  {/*  <h4 className="font-medium text-gray-900">Dimensions</h4>*/}
                  {/*  <p className="text-gray-600">Variable dimensions</p>*/}
                  {/*</div>*/}
                  {/*<div>*/}
                  {/*  <h4 className="font-medium text-gray-900">Medium</h4>*/}
                  {/*  <p className="text-gray-600">Mixed media</p>*/}
                  {/*</div>*/}
                  <div>
                    <h4 className="font-medium text-gray-900">Year</h4>
                    <p className="text-gray-600" data-testid="modal-details-date">{artwork.date}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)
  );
};

export default ArtworkModal;
