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
            <div className="flex flex-col md:flex-row h-full mb-[250px] relative">
                <Carousel />
                <div className="z-10 absolute flex flex-col items-center justify-center px-4 md:px-12 md:h-[200px] rounded-[12px] bg-transparent gap-1 w-full md:w-[200px] md:absolute md:top-[220px]">
                    <span className="p-2 rounded-[12px] text-[#000] bg-white bg-opacity-5 backdrop-blur-sm text-xl md:text-[2.5em] font-bold mb-3 text-center">
                        Bienvenue sur le site de l’Association pour l’Évangélisation des Enfants
                    </span>
                    <p className="p-3 rounded-[12px] text-[#000] text-lg md:text-[1.8em] flex items-center font-bold bg-white bg-opacity-10 backdrop-blur-sm w-full md:w-4/5 text-center">
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
