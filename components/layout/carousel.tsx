"use client";

import React from 'react';
import { useCMS } from '../cms/cms-provider';

const Carousel = () => {
  const { dictionary } = useCMS();
  // Fetch video URL from CMS or fallback to local
  const videoSrc = dictionary['home.hero.video_url'] || '/videos/video-intro.mp4';

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div className="w-full h-full">
        <div
          className="relative w-full h-full overflow-hidden rounded-b-2xl border-b-4 border-white"
        >
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            key={videoSrc} // Force re-render if src changes
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Overlay to allow editing the video URL via text if needed */}
          <div className="absolute top-0 left-0 w-0 h-0 overflow-hidden">
              {/* Hidden text element to register the key in CMS indexer/editor */}
              <span data-cms-key="home.hero.video_url">{videoSrc}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Carousel;
