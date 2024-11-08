import Gallery from '@/components/Gallery';
import galleryData from '@/data/events-decor.json';

export default function EventsDecor() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold mb-4">Events Decor</h1>
            <p className="text-gray-600 mb-8">Discover our unique event decoration services that transform spaces into unforgettable experiences.</p>
            <Gallery items={galleryData.items} />
        </div>
    );
}