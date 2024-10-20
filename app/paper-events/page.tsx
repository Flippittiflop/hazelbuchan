import Gallery from '@/components/Gallery';

const paperEventsItems = [
  { id: 1, src: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb', alt: 'Paper event installation 1', title: 'Paper Lantern Festival', date: 'May 2023', description: 'A magical paper lantern installation created for a summer festival, bringing light and wonder to the event.' },
  { id: 2, src: 'https://images.unsplash.com/photo-1530982011887-3cc11cc85693', alt: 'Paper event installation 2', title: 'Origami Wedding Decor', date: 'June 2023', description: 'Elegant origami decorations designed for a wedding, adding a unique and personal touch to the celebration.' },
  { id: 3, src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205', alt: 'Paper event installation 3', title: 'Paper Flower Wall', date: 'July 2023', description: 'A stunning paper flower wall created as a backdrop for a fashion show, combining beauty and sustainability.' },
  { id: 4, src: 'https://images.unsplash.com/photo-1513151233558-d860c5398176', alt: 'Paper event installation 4', title: 'Corporate Event Paper Art', date: 'August 2023', description: 'Custom paper art installations designed for a corporate event, reflecting the company\'s brand and values.' },
  { id: 5, src: 'https://images.unsplash.com/photo-1515169067868-5387ec356754', alt: 'Paper event installation 5', title: 'Paper Fashion Show', date: 'September 2023', description: 'An avant-garde fashion show featuring clothing and accessories made entirely from paper, pushing the boundaries of design.' },
  { id: 6, src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205', alt: 'Paper event installation 6', title: 'Interactive Paper Installation', date: 'October 2023', description: 'An interactive paper-based art installation that invites event attendees to participate and engage with the artwork.' },
];

export default function PaperEvents() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-4">Paper Events</h1>
      <p className="text-gray-600 mb-8">Discover my paper art installations that bring events to life with unique and captivating designs.</p>
      <Gallery items={paperEventsItems} />
    </div>
  );
}