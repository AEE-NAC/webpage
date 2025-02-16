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
      <div className="relative w-full h-screen">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="/api/placeholder/1920/1080" 
          alt="Happy Haitian children" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay */}
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <h1 className="text-white text-6xl font-bold">
                Mission Haiti
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-blue-500" />
              <p className="text-white text-xl max-w-xl">
                Serving communities in Haiti through faith, education, and humanitarian aid. Join us in making a difference in the lives of Haitian families.
              </p>
              <button className="bg-yellow-300 hover:bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
                <span>Explor</span>
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  strokeWidth="2"
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Right Column - Haiti Map */}
            <div className="flex justify-center">
              <div className="relative w-96 h-96">
                <img 
                  src="/api/placeholder/400/400" 
                  alt="Haiti Map" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Stats Box */}
          <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md rounded-lg p-6 text-white grid grid-cols-2 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold">1k</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">1k</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  };


  const Haiti_page = () => {
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

export default Haiti_page;
