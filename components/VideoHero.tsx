"use client"

interface VideoHeroProps {
  videoSources?: {
    src: string;
  }[];
}

export default function VideoHero({ videoSources = [] }: VideoHeroProps) {
  if (videoSources.length === 0) {
    return null;
  }

  return (
      <div className="relative w-full h-[70vh] overflow-hidden">
        <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover"
        >
          {videoSources.map((source, index) => (
              <source key={index} src={source.src} />
          ))}
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>
  );
}
