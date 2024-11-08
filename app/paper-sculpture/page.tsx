import Gallery from '@/components/Gallery';
import galleryData from '@/data/paper-sculpture.json';

export default function PaperSculpture() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold mb-4">Paper Sculpture</h1>
            <p className="text-gray-600 mb-8">Explore my paper sculpture projects that blend artistry with dimensional creativity.</p>
            <Gallery items={galleryData.items} />
        </div>
    );
}