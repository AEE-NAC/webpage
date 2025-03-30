import React from 'react';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import Ministries from '../components/layout/ministries';
import About from '../components/layout/About';
import Carousel from '../components/layout/carousel';
import WeeklyWord from '../components/layout/weekly';
import Blog from '../components/layout/Blog';
import Popsurvey from "../components/common/popsurvey";
import VoiceTestimonial from '../components/ui/VoiceTestimonial'

const testimonials = [

  {
    image: 'https://via.placeholder.com/150',
    text: 'Using this component library has significantly speed up our development process. The quality and ease of integration are remarkable!',
    name: 'David Smith',
    jobtitle: 'UI Designer',
    audio: 'David.mp3',
    social: 'https://x.com'
    
  },
  {
    image: 'https://via.placeholder.com/150',
    text: 'I love  how intuitive and well-documented this component library is. It has significantly improved our UI consistency across projects.',
    name: 'James Wilson',
    jobtitle: 'Product Manager',
    audio: 'James.mp3',
    social: 'https://x.com'
  },
  {
    image: 'https://via.placeholder.com/150',
    text: 'Using this library has been a game-changer for our product development.',
    name: 'Michael Davis',
    jobtitle: 'Full Stack Developer',
    audio: 'Michael.mp3',
    social: 'https://x.com'
  },
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
          <Popsurvey />
          <VoiceTestimonial mode='light' testimonials={testimonials} />
        </div>
        <Footer />
      </>
    );
};

export default LandingPage;
