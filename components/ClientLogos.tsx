import Image from 'next/image';

const clients = [
  { name: 'Client 1', logo: '/client-logo-1.svg' },
  { name: 'Client 2', logo: '/client-logo-2.svg' },
  { name: 'Client 3', logo: '/client-logo-3.svg' },
  { name: 'Client 4', logo: '/client-logo-4.svg' },
  { name: 'Client 5', logo: '/client-logo-5.svg' },
  { name: 'Client 6', logo: '/client-logo-6.svg' },
];

const ClientLogos = () => {
  return (
    <div className="w-full overflow-hidden bg-gray-100 py-10">
      <div className="flex animate-scroll">
        {[...clients, ...clients].map((client, index) => (
          <div key={index} className="flex-shrink-0 w-48 mx-8">
            <Image
              src={client.logo}
              alt={client.name}
              width={150}
              height={75}
              className="filter grayscale opacity-50 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientLogos;