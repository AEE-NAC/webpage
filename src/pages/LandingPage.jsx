import React from 'react';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import Ministries from '../components/layout/ministries';
import About from '../components/layout/About';
import Carousel from '../components/layout/carousel';
import WeeklyWord from '../components/layout/weekly';
import Blog from '../components/layout/Blog';

const LandingPage = () => {
    return (
        <>
            <Header />
            <div className="flex flex-col md:flex-row h-full  relative rounded-[12px]">
  <Carousel />
  <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center p-4 rounded-[12px] bg-white bg-opacity-30 w-full">
    <span className="text-[#000] text-xl md:text-[2.5em] font-bold mb-3 text-center">
      Bienvenue sur le site de l’Association pour l’Évangélisation des Enfants
    </span>
    <p className="text-[#000] text-lg md:text-[1.8em] font-bold text-center">
      De la Région Nord/Sud Amérique et Caraïbes Créolophone et Francophone
    </p>
  </div>
</div>

            <About />
            <Ministries />
            <WeeklyWord />
            <Blog />
            <Footer />
        </>
    );
};

export default LandingPage;
