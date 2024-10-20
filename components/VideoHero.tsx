"use client"

import { useRef, useEffect } from 'react';

const VideoHero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let playPromise: Promise<void> | undefined;

    if (videoRef.current) {
      playPromise = videoRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          if (error.name !== 'AbortError') {
            console.error('Video playback error:', error);
          }
        });
      }
    }

    return () => {
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (videoRef.current) {
            videoRef.current.pause();
          }
        }).catch(() => {
          // Ignore any errors during cleanup
        });
      }
    };
  }, []);

  return (
    <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/hero-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to My Artistic World</h1>
          <p className="text-xl md:text-2xl">Exploring creativity through various mediums</p>
        </div>
      </div>
    </div>
  );
};

export default VideoHero;