"use client"

import Image from "next/image";

interface ClientLogo {
  id: number;
  name: string;
  logo: string;
  url: string;
}

interface ClientLogosProps {
  items: ClientLogo[];
}

const ClientLogos = ({ items }: ClientLogosProps) => {
  return (
    (<section className="w-full overflow-hidden bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex animate-scroll">
          {[...items, ...items].map((client, index) => (
              <a
                  key={`${client.id}-${index}`}
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-48 mx-8 group"
                  aria-label={`Visit ${client.name}'s website`}
              >
                <Image
                  src={client.logo}
                  alt={`${client.name} logo`}
                  width={150}
                  height={75}
                  className="filter grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300"
                  style={{
                    maxWidth: "100%",
                  }} />
              </a>
          ))}
        </div>
      </div>
    </section>)
  );
};

export default ClientLogos;
