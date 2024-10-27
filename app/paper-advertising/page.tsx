import Gallery from '@/components/Gallery';
import galleryData from '@/data/paper-advertising.json';

export default function PaperAdvertising() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold mb-4">Paper Advertising</h1>
            <p className="text-gray-600 mb-8">Explore my paper-based advertising projects that blend creativity with effective communication.</p>
            <Gallery items={galleryData.items} />
        </div>
    );
}
