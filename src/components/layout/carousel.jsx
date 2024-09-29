import React from 'react';

const Carousel = () => (
  <section className="relative w-full h-screen overflow-hidden">
    <div className="w-full h-full">
      <div
        aria-roledescription="carousel"
        className="relative w-full h-full overflow-hidden rounded-b-2xl border-b-4 border-white"
        role="region"
      >
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
        >
          <source src="/videos/video-intro.mp4" type="video/mp4" />
          Votre navigateur ne supporte pas la balise vidéo.
        </video>
      </div>
    </div>
  </section>
);

export default Carousel;
