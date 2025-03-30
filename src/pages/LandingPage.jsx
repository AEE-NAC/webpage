import React from 'react';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import Ministries from '../components/layout/ministries';
import About from '../components/layout/About';
import Carousel from '../components/layout/carousel';
import WeeklyWord from '../components/layout/weekly';
import Blog from '../components/layout/Blog';
import VoiceTestimonial from '../components/ui/VoiceTestimonial'
import { FloatingEventCard } from '../components/ads';
const testimonials = [
  {
    image: 'https://i.pravatar.cc/400',
    text: "L'AEE m'a permis de découvrir ma vocation dans l'enseignement biblique aux enfants. Les formations et le matériel pédagogique sont vraiment excellents !",
    name: 'Marie Dupont',
    jobtitle: 'Monitrice Club d\'enfants',
    audio: 'Marie.mp3',
    social: 'https://x.com'
  },
  {
    image: 'https://i.pravatar.cc/300',
    text: "Grâce aux ressources de l'AEE, nous avons pu mettre en place un programme d'évangélisation efficace dans notre église. Les enfants adorent les leçons bibliques interactives.",
    name: 'Jean-Pierre Laurent',
    jobtitle: 'Responsable École du Dimanche',
    audio: 'Jean.mp3',
    social: 'https://x.com'
  },
  {
    image: 'https://i.pravatar.cc/100',
    text: "Je suis reconnaissante pour le soutien et la formation reçus de l'AEE. Cela fait maintenant 5 ans que j'anime des clubs bibliques et je vois l'impact positif sur les enfants.",
    name: 'Sophie Martin',
    jobtitle: 'Coordinatrice Régionale',
    audio: 'Sophie.mp3',
    social: 'https://x.com'
  },
];
const events = [
  {
    title: "Ministère d'Été",
    date: "Mardi 8 Avril 2025",
    time: "17H - 19H",
    description: "Présentation de ministères d'été pour les enfants.",
    image: "/bootcamp.svg",
  },
  // Ajoute d'autres événements ici
];
const LandingPage = () => {
    return (
      <>
        <Header />
        <div className="flex flex-col md:flex-row h-full relative rounded-[12px]">
          <Carousel />
          <div 
            className="absolute bottom-0 left-0 right-0 min-h-[300px] flex flex-col items-center justify-center p-8 rounded-[12px]"
            style={{
              background: 'linear-gradient(to bottom, rgb(152 26 60 / 0%) 0%, rgba(152, 26, 60, 0.95) 40%)',
              backdropFilter: 'blur(1px)'
            }}
          >
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-white text-2xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Bienvenue sur le site de
                <span className="block mt-2 bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
                  l'Association pour l'Évangélisation des Enfants
                </span>
              </h1>
              <div className="w-20 h-1 mx-auto bg-white/30" />
              <p className="text-white/90 text-lg md:text-2xl font-medium leading-relaxed">
                De la Région Nord/Sud Amérique<br />
                et Caraïbes Créolophone et Francophone
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-screen justify-center">
          <About />
          <Ministries />
          <WeeklyWord />
          <Blog />
          <FloatingEventCard event={events[0]}></FloatingEventCard>
          <VoiceTestimonial mode='light' testimonials={testimonials} />
        </div>
        <Footer />
      </>
    );
};

export default LandingPage;
