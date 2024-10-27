import Gallery from '@/components/Gallery';
import galleryData from '@/data/paper-events.json';

export default function PaperEvents() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold mb-4">Paper Events</h1>
            <p className="text-gray-600 mb-8">Discover my paper art installations that bring events to life with unique and captivating designs.</p>
            <Gallery items={galleryData.items} />
        </div>
    );
}
