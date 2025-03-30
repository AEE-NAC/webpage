import { useState } from "react";
import Card from "./ui/card";
import  Button  from "./ui/button";
import { motion } from "framer-motion";

const events = [
  {
    title: "Ministère d'Été",
    date: "Mardi 8 Avril 2025",
    time: "17H - 19H",
    description: "Présentation de ministères d'été pour les enfants.",
    image: "/event-image.jpg",
  },
  // Ajoute d'autres événements ici
];

export default function NewsletterPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Newsletter des Événements</h1>
      <div className="grid gap-6">
        {events.map((event, index) => (
          <EventCard key={index} event={event} />
        ))}
      </div>
      <FloatingEventCard event={events[0]} />
    </div>
  );
}

function EventCard({ event }) {
  return (
    <Card className="rounded-2xl shadow-lg overflow-hidden">
      <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-bold">{event.title}</h2>
        <p className="text-gray-600">{event.date} - {event.time}</p>
        <p className="mt-2">{event.description}</p>
      </div>
    </Card>
  );
}

function FloatingEventCard({ event }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 right-4 bg-white shadow-lg rounded-2xl p-4 w-64 z-50 border border-gray-300">
      <button onClick={() => setVisible(false)} className="absolute top-2 right-2 text-gray-500">✖</button>
      <img src={event.image} alt={event.title} className="w-full h-24 object-cover rounded-lg" />
      <h3 className="text-lg font-bold mt-2">{event.title}</h3>
      <p className="text-sm text-gray-600">{event.date} - {event.time}</p>
      <Button className="mt-3 w-full">En savoir plus</Button>
    </motion.div>
  );
}

export {
    EventCard,
    FloatingEventCard,
    events
}