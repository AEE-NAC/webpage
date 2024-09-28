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
               <Header></Header>
               <div className='flex h-full mb-[250px]'>
               <Carousel></Carousel>
                        <div className='flex px-12 h-[200px] flex-col rounded-[12px] bg-transparent gap-1 column w-full items-center left-0 w-[200] absolute top-[220px]'>
              <span className='p-2 rounded-[12px] text-[#000] bg-white bg-opacity-5 backdrop-blur-sm text-[2.5em] font-bold mb-3'>
                Bienvenue sur le site de l’Association pour l’Évangélisation des Enfants
              </span>
              <p className='p-3 rounded-[12px] text-[#000]  text-[1.8em] flex items-center font-bold bg-white bg-opacity-10 backdrop-blur-sm w-4/5 relative left-0'>
                De la Région Nord/Sud Amérique et Caraïbes Créolophone et Francophone
              </p>
               </div>
               </div>
               <About></About>
               <Ministries></Ministries>
               <WeeklyWord></WeeklyWord>
               <Blog></Blog>
               <Footer></Footer>
            </>
    );
};

export default LandingPage;
