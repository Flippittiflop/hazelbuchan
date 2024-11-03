import heroData from '@/data/hero.json';
import aboutData from '@/data/about.json';
import featuredWorksData from '@/data/featured-works.json';
import clientLogosData from '@/data/client-logos.json';
import VideoHero from '@/components/VideoHero';
import About from '@/components/About';
import FeaturedWorks from '@/components/FeaturedWorks';
import ClientLogos from '@/components/ClientLogos';

export default function Home() {
    return (
        <div className="space-y-8">
            <VideoHero
                backgroundImages={heroData.backgroundImages}
                content={heroData.content}
            />
            <About content={aboutData.content} />
            <FeaturedWorks items={featuredWorksData.items} />
            <ClientLogos items={clientLogosData.items} />
        </div>
    );
}
