import React from 'react';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import Ministries from '../components/layout/ministries';
import About from '../components/layout/About';
import Carousel from '../components/layout/carousel';
import WeeklyWord from '../components/layout/weekly';
import Blog from '../components/layout/Blog';
import Popsurvey from "../components/common/popsurvey";

const LandingPage = () => {
    return (
      <>
        <Header />
        <div className="flex flex-col md:flex-row h-full relative rounded-[12px]">
          <Carousel />
          <div 
            className="absolute bottom-0 left-0 right-0 min-h-[300px] flex flex-col items-center justify-center p-8 rounded-[12px]"
            style={{
              background: 'linear-gradient(to bottom, rgba(152, 26, 60, 0.2) 0%, rgba(152, 26, 60, 0.95) 40%)',
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
        </div>
        <Footer />
      </>
    );
};

export default LandingPage;
