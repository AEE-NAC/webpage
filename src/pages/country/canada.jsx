import React from 'react';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import Ministries from '../../components/layout/ministries';
import About from '../../components/layout/About';
import Carousel from '../../components/layout/carousel';
import WeeklyWord from '../../components/layout/weekly';
import Blog from '../../components/layout/Blog';
import Popsurvey from "../../components/common/popsurvey";

const HeroSection = () => {
    return (
      <div className="relative h-[80vh] w-full bg-haiti-hero bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50"> {/* Overlay */}
          <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Mission Haiti</h1>
            <p className="text-xl md:text-2xl max-w-3xl text-center">
              Serving communities in Haiti through faith, education, and humanitarian aid. 
              Join us in making a difference in the lives of Haitian families.
            </p>
          </div>
        </div>
      </div>
    );
  };


  const Canada_page = () => {
    return (
      <>
        <Header />
        <HeroSection />
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

export default Canada_page;
