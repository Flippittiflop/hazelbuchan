import Gallery from '@/components/Gallery';
import galleryData from '@/data/illustration.json';

export default function Illustration() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold mb-4">Illustration Gallery</h1>
            <p className="text-gray-600 mb-8">Browse through my collection of illustrations showcasing various styles and techniques.</p>
            <Gallery items={galleryData.items} />
        </div>
    );
}
