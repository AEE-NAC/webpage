import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const WaveVariants = () => {
  const waveVariants = [];
  for (let i = 0; i < 30; i++) {
    waveVariants.push({
      initial: {
        scaleY: 1.5,
        transition: { duration: 0.5 },
      },
      animate: {
        scaleY: [1, Math.random() * 1.2 + 1, 1],
        transition: {
          duration: Math.random() * 0.5 + 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: Math.random() * 0.5,
        },
      },
    });
  }
  return waveVariants;
};

const waveVariants = WaveVariants();

const VoiceTestimonial = ({ mode, testimonials }) => {
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);
  const [audioElements, setAudioElements] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const elements = [];
    testimonials.forEach((testimonial) => {
      if (testimonial.audio) {
        const audio = new Audio(`/audio/${testimonial.audio}`);
        audio.addEventListener('ended', handleAudioEnded);
        elements.push(audio);
      } else {
        elements.push(null);
      }
    });
    setAudioElements(elements);

    return () => {
      elements.forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.removeEventListener('ended', handleAudioEnded);
        }
      });
    };
  }, [testimonials]);

  const handlePlay = (index) => {
    if (currentPlayingIndex !== null && currentPlayingIndex !== index) {
      stopAudio(currentPlayingIndex);
    }

    const audio = audioElements[index];
    if (audio) {
      audio.play().catch((error) => console.error('Audio playback error:', error));
      setCurrentPlayingIndex(index);
    }
  };

  const stopAudio = (index) => {
    const audio = audioElements[index];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setCurrentPlayingIndex(null);
    }
  };

  const handlePause = (index) => stopAudio(index);
  const handleAudioEnded = () => setCurrentPlayingIndex(null);
  const handleLoadMore = () => setShowAll(true);

  const openInNewTab = (url) => {
    const win = window.open(url, '_blank');
    if (win) win.focus();
  };

  const shouldShowLoadMore = testimonials.length > 6;

  return (
    <section className="bg-[#fdfff4ff] w-full flex justify-center px-4 py-8 md:py-16 lg:py-24">
      <div className="container max-w-7xl mx-auto">
        <div className="space-y-3 md:space-y-4 text-center">
          <div className="inline-block rounded-full bg-[#f2e288] px-3 md:px-4 py-1 text-xs md:text-sm text-[#0f0f0fff]">
            Témoignages
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0f0f0fff]">
            Découvrez ce que les gens en disent
          </h2>
          <p className="text-sm md:text-base text-[#878578ff] max-w-2xl mx-auto">
            Découvrez ce que les membres de notre communauté ont partagé sur leurs expériences
          </p>
        </div>

        <div className="relative mt-6 md:mt-8">
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 ${showAll ? 'max-h-full' : 'max-h-[720px]'} relative`}>
            {shouldShowLoadMore && !showAll && (
              <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#fdfff4ff] to-transparent z-10" />
            )}
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="text-card-foreground shadow-sm bg-[#fdfff4ff] border border-[#878578ff] rounded-xl md:rounded-2xl overflow-hidden p-4 md:p-6 space-y-3 md:space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={testimonial.image || 'https://via.placeholder.com/50'}
                      alt="profile"
                      className="w-10 h-10 md:w-[50px] md:h-[50px] rounded-full"
                    />
                    <div className="flex flex-col pl-3 md:pl-4">
                      <span className="text-sm md:text-base text-[#0f0f0fff] font-semibold">{testimonial.name}</span>
                      <span className="text-xs md:text-sm text-[#878578ff]">
                        {testimonial.jobtitle}
                      </span>
                    </div>
                  </div>
                  <img 
                    src="/logo.png"
                    onClick={() => openInNewTab(testimonial.social || '')}
                    className="w-6 h-6 cursor-pointer" 
                    alt="logo"
                  />
                </div>
                <p className="text-sm md:text-base text-[#0f0f0fff]">{testimonial.text}</p>
                <div className="bg-[#981a3c]/10 w-full h-10 md:h-12 rounded-lg flex justify-center items-center p-2 relative">
                  {currentPlayingIndex !== index ? (
                    <button onClick={() => handlePlay(index)} style={{backgroundColor:"transparent"}} className="focus:outline-none">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-[#981a3c] w-8 h-8 md:w-10 md:h-10">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" />
                      </svg>
                    </button>
                  ) : (
                    <button onClick={() => handlePause(index)} style={{backgroundColor:"transparent"}} className="focus:outline-none bg-transparent">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="text-[#981a3c] w-8 h-8 md:w-10 md:h-10">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM9 8.25a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75h.75a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75H9Zm5.25 0a.75.75 0 0 0-.75.75v6c0 .414.336.75.75.75H15a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75h-.75Z" />
                      </svg>
                    </button>
                  )}
                  <div className="flex ml-3 md:ml-4">
                    {waveVariants.map((variant, i) => (
                      <motion.div
                        key={i}
                        className="bg-[#981a3c]"
                        style={{
                          width: '2px',
                          height: `${Math.random() * 16 + 4}px`,
                          margin: '0 1px',
                          borderRadius: '2px',
                        }}
                        variants={variant}
                        initial="initial"
                        animate={currentPlayingIndex === index ? 'animate' : 'initial'}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {shouldShowLoadMore && !showAll && (
            <div className="flex justify-center mt-6 md:mt-8">
              <button
                className="px-4 md:px-6 py-2 text-sm md:text-base bg-[#981a3c] text-white rounded-full hover:bg-[#981a3c]/90 transition"
                onClick={handleLoadMore}
              >
                Voir plus
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VoiceTestimonial;