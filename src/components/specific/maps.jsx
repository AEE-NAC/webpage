import React, { useEffect, useRef, useState } from 'react';
import DottedMap from 'dotted-map';
import { motion, AnimatePresence } from 'framer-motion';
import * as Popover from '@radix-ui/react-popover';

// Event type definition
const Event = {
    id: String,
    title: String,
    coordinates: Array,
    country: String,
    attendees: Number,
    image: String
};

// Events data
const events = [
    {
        id: '1',
        title: 'Haiti Event',
        coordinates: [-72.2852, 18.9712], // Haiti coordinates
        country: 'Haiti',
        attendees: 1500,
        image: '/images/haiti.jpg'
    },
    {
        id: '2',
        title: 'Martinique Event',
        coordinates: [-61.0242, 14.6415], // Martinique coordinates
        country: 'Martinique',
        attendees: 800,
        image: '/images/martinique.jpg'
    },
    {
        id: '3',
        title: 'Guyane Event',
        coordinates: [-53.1258, 3.9339], // French Guiana coordinates
        country: 'Guyane',
        attendees: 1200,
        image: '/images/guyane.jpg'
    }
];

function EventMap() {
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [map, setMap] = useState('');
    const currentEvent = events[currentEventIndex];
    const intervalRef = useRef();

    useEffect(() => {
        const dottedMap = new DottedMap({ height: 120, width: 250, grid: 'diagonal' });
        events.forEach(event => {
            dottedMap.addPin({
                lat: event.coordinates[1],
                lng: event.coordinates[0],
                svgOptions: { color: '#000000', radius: 0.8 }
            });
        });
        setMap(dottedMap.getSVG({
            shape: 'circle',
            backgroundColor: 'transparent',
            color: '#FFFFFF',
            radius: 0.45,
        }));

        intervalRef.current = window.setInterval(() => {
            setCurrentEventIndex((prev) => (prev + 1) % events.length);
        }, 5000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <div className="h-[400px] w-[95%] px-[26px] text-white rounded-[12px]">
            <div className="bg-gray-900 container mx-auto p-6 h-[90%] grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                {/* Left Section - Stats */}
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
                                    <span className="text-gray-200">Location:</span>
                                    <span className="text-white">{currentEvent.country}</span>
                                </div>
                                <motion.div
                                    key={currentEvent.attendees}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center space-x-4"
                                >
                                    <span className="text-gray-200">Attendees:</span>
                                    <span className="text-white">{currentEvent.attendees.toLocaleString()}</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Middle Section - Carousel */}
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
                                    transition={{
                                        duration: index === currentEventIndex ? 5 : 0
                                    }}
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

                {/* Right Section - Map */}
                <div className="relative">
                    <div 
                        className="w-full h-full rounded-3xl overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: map }}
                    />
                    
                    {events.map((event, index) => (
                        <Popover.Root key={event.id}>
                            <Popover.Trigger asChild>
                                <motion.div
                                    className="absolute transform -translate-x-2 -translate-y-2"
                                    style={{
                                        left: `${((event.coordinates[0] + 180) / 360) * 250}px`,
                                        top: `${((90 - event.coordinates[1]) / 180) * 120}px`,
                                        position: 'absolute',
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
                                    <div className={`w-4 h-4 rounded-full ${
                                        currentEventIndex === index ? 'bg-white' : 'bg-black'
                                    }`} />
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
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EventMap;