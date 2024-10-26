import Gallery from '@/components/Gallery';

const paperAdvertisingItems = [
  { id: 1, src: 'https://images.unsplash.com/photo-1622737133809-d95047b9e673', alt: 'Paper advertising sample 1', title: 'Creative Paper Billboard', date: 'June 2023', description: 'An innovative paper billboard design that showcases the versatility of paper in outdoor advertising.' },
  { id: 2, src: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3', alt: 'Paper advertising sample 2', title: 'Origami Product Display', date: 'July 2023', description: 'A unique product display using origami techniques to create an eye-catching and memorable brand experience.' },
  { id: 3, src: 'https://images.unsplash.com/photo-1574096079513-d8259312b785', alt: 'Paper advertising sample 3', title: 'Paper Art Installation', date: 'August 2023', description: 'A large-scale paper art installation designed for a brand activation event, combining art and advertising.' },
  { id: 4, src: 'https://images.unsplash.com/photo-1574096079513-d8259312b785', alt: 'Paper advertising sample 4', title: 'Paper Sculpture Ad', date: 'September 2023', description: 'A detailed paper sculpture created for a print advertisement, showcasing intricate craftsmanship.' },
  { id: 5, src: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2', alt: 'Paper advertising sample 5', title: 'Eco-friendly Paper Campaign', date: 'October 2023', description: 'An eco-friendly advertising campaign using recycled paper to promote sustainability and brand values.' },
  { id: 6, src: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2', alt: 'Paper advertising sample 6', title: 'Interactive Paper Display', date: 'November 2023', description: 'An interactive paper-based display that engages customers through tactile experiences and clever design.' },
];

export default function PaperAdvertising() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-4">Paper Advertising</h1>
      <p className="text-gray-600 mb-8">Explore my paper-based advertising projects that blend creativity with effective communication.</p>
      <Gallery items={paperAdvertisingItems} />
    </div>
  );
}
