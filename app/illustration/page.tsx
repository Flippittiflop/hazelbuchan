import Gallery from '@/components/Gallery';

const illustrationItems = [
  { id: 1, src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe', alt: 'Illustration sample 1', title: 'Whimsical Forest Scene', date: 'April 2023', description: 'A detailed illustration of a magical forest, featuring fantastical creatures and hidden surprises.' },
  { id: 2, src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5', alt: 'Illustration sample 2', title: 'Urban Landscape Sketch', date: 'May 2023', description: 'A quick sketch capturing the essence of a bustling city street, with loose lines and vibrant energy.' },
  { id: 3, src: 'https://images.unsplash.com/photo-1613312328068-c9b6b76c9e8a', alt: 'Illustration sample 3', title: 'Character Design Study', date: 'June 2023', description: 'A series of character designs exploring different personalities and styles for a potential animation project.' },
  { id: 4, src: 'https://images.unsplash.com/photo-1611244419377-b0a760c19719', alt: 'Illustration sample 4', title: 'Abstract Watercolor', date: 'July 2023', description: 'An abstract watercolor piece exploring the interplay of colors and shapes in a fluid, organic composition.' },
  { id: 5, src: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa', alt: 'Illustration sample 5', title: 'Digital Concept Art', date: 'August 2023', description: 'A piece of concept art for a science fiction project, showcasing a futuristic cityscape with advanced technology.' },
  { id: 6, src: 'https://images.unsplash.com/photo-1611244419377-b0a760c19719', alt: 'Illustration sample 6', title: 'Mixed Media Collage', date: 'September 2023', description: 'A mixed media illustration combining traditional drawing techniques with digital elements and collage.' },
];

export default function Illustration() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-4">Illustration Gallery</h1>
      <p className="text-gray-600 mb-8">Browse through my collection of illustrations showcasing various styles and techniques.</p>
      <Gallery items={illustrationItems} />
    </div>
  );
}