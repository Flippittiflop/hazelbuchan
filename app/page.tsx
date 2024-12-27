import heroImages from '@/data/hero.json';
import heroText from '@/data/hero-text.json';
import aboutData from '@/data/about.json';
import featuredWorksData from '@/data/featured.json';
import clientLogosData from '@/data/client-logos.json';
import About from '@/components/About';
import FeaturedWorks from '@/components/FeaturedWorks';
import ClientLogos from '@/components/ClientLogos';
import Hero from '@/components/Hero';

export default function Home() {
    return (
        <div className="space-y-8">
            <Hero
                backgroundImage={heroImages.items[0]}
                content={heroText.content}
            />
            <About content={aboutData.content} />
            <FeaturedWorks items={featuredWorksData.items} />
            {/*<ClientLogos items={clientLogosData.items} />*/}
        </div>
    );
}
