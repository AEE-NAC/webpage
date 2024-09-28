import React from 'react';

const Carousel = () => (
  <section className="bg-[#fdfff4ff] py-12 md:py-34 lg:py-[-32px] absolute w-full h-full">
    <div className="container w-full">
            <div aria-roledescription="carousel" className="relative rounded-2xl overflow-hidden w-full" role="region">
                <video className="sticky z-0 w-full h-full object-cover" autoPlay loop muted>
          <source src="/videos/video-intro.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  </section>
);

export default Carousel;
