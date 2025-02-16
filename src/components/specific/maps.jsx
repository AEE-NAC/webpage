import React, { useEffect, useRef, useState } from 'react';
import DottedMap from 'dotted-map';
import { motion, AnimatePresence } from 'framer-motion';
import * as Popover from '@radix-ui/react-popover';
import countries from 'world-countries';

// Fonction pour obtenir les coordonnées GPS depuis le nom du pays
const getCoordinatesByCountry = (countryName) => {
  const country = countries.find(c => c.name.common === countryName);
  if (country) {
    return [country.latlng[1], country.latlng[0]]; // [lng, lat]
  }
  
  // Gestion des territoires spéciaux
  switch(countryName) {
    case 'Martinique':
      return [-61.0242, 14.6415];
    case 'Guyane':
      return [-53.1258, 3.9339];
    default:
      console.error('Pays non trouvé :', countryName);
      return [0, 0];
  }
};

// Données des événements
const events = [
  {
    id: '1',
    title: 'Haiti Event',
    country: 'Haiti',
    attendees: 1500,
    image: '/images/haiti.jpg'
  },
  {
    id: '2',
    title: 'Martinique Event',
    country: 'Martinique',
    attendees: 800,
    image: '/images/martinique.jpg'
  },
  {
    id: '3',
    title: 'Guyane Event',
    country: 'Guyane',
    attendees: 1200,
    image: '/images/guyane.jpg'
  }
];

function EventMap() {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [map, setMap] = useState('');
  const [dimensions, setDimensions] = useState({ width: 520, height: 400 });
  const containerRef = useRef(null);
  const currentEvent = events[currentEventIndex];
  const intervalRef = useRef();

  // Gestion du redimensionnement
  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    if (containerRef.current) observer.observe(containerRef.current);
    
    return () => {
      observer.disconnect();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Génération de la carte
  useEffect(() => {
    const dottedMap = new DottedMap({ 
      height: dimensions.height, 
      width: dimensions.width,
      grid: 'diagonal' 
    });

    events.forEach(event => {
      const [lng, lat] = getCoordinatesByCountry(event.country);
      dottedMap.addPin({
        lat,
        lng,
        svgOptions: { color: '#000000', radius: 0.8 }
      });
    });

    const svg = dottedMap.getSVG({
      shape: 'circle',
      backgroundColor: 'transparent',
      color: '#FFFFFF',
      radius: 0.45,
      viewBox: `0 0 ${dimensions.width} ${dimensions.height}`
    })
    .replace(/width="[^"]*"/, 'width="100%"')
    .replace(/height="[^"]*"/, 'height="100%"');

    setMap(svg);
  }, [dimensions]);

  // Animation automatique
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentEventIndex(prev => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div ref={containerRef} className="h-[50vh] w-full px-[26px] text-white rounded-[12px]">
      <div className="bg-gray-900 container mx-auto p-6 h-full grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        
        {/* Section gauche - Statistiques */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-[#800020] p-6 rounded-3xl"
            >
              <h2 className="text-3xl font-bold mb-4">{currentEvent.title}</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-200">Localisation :</span>
                  <span className="text-white">{currentEvent.country}</span>
                </div>
                <motion.div
                  key={currentEvent.attendees}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-4"
                >
                  <span className="text-gray-200">Participants :</span>
                  <span className="text-white">{currentEvent.attendees.toLocaleString()}</span>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Section centrale - Carousel */}
        <div className="relative">
          <div className="flex gap-2 mb-4">
            {events.map((_, index) => (
              <div key={index} className="h-1 flex-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{
                    width: index === currentEventIndex ? "100%" : 
                         index < currentEventIndex ? "100%" : "0%"
                  }}
                  transition={{ duration: index === currentEventIndex ? 5 : 0 }}
                />
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentEvent.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative h-[300px] rounded-3xl overflow-hidden"
            >
              <img
                src={currentEvent.image}
                alt={currentEvent.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Section droite - Carte */}
        <div className="relative h-full w-full">
          <div 
            className="w-full h-full rounded-3xl overflow-hidden"
            dangerouslySetInnerHTML={{ __html: map }}
          />
          
          {events.map((event, index) => {
            const [lng, lat] = getCoordinatesByCountry(event.country);
            return (
              <Popover.Root key={event.id}>
                <Popover.Trigger asChild>
                  <motion.div
                    className="absolute transform -translate-x-2 -translate-y-2"
                    style={{
                      left: `${((lng + 180) / 360) * dimensions.width}px`,
                      top: `${((90 - lat) / 180) * dimensions.height}px`,
                      zIndex: 10
                    }}
                    animate={{
                      scale: currentEventIndex === index ? [1, 1.4, 1] : 1,
                    }}
                    transition={{
                      repeat: currentEventIndex === index ? Infinity : 0,
                      duration: 2
                    }}
                  >
                    <div className={`w-4 h-4 rounded-full ${currentEventIndex === index ? 'bg-white' : 'bg-black'}`} />
                  </motion.div>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className="bg-white text-black p-3 rounded-3xl shadow-lg"
                    sideOffset={5}
                  >
                    <p className="font-semibold">{event.country}</p>
                    <Popover.Arrow className="fill-white" />
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default EventMap;