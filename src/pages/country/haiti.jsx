import React, { useState, useEffect } from 'react';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import Ministries from '../../components/layout/ministries';
import About from '../../components/layout/About';
import Carousel from '../../components/layout/carousel';
import WeeklyWord from '../../components/layout/weekly';
import Blog from '../../components/layout/Blog';
import Popsurvey from "../../components/common/popsurvey";

const HeroSection = () => {
    const [count, setCount] = useState(0);
    const targetCount = 1000; // Nombre final d'enfants touchés
    
    useEffect(() => {
        const duration = 2000; // Durée de l'animation en ms
        const steps = 50;
        const increment = targetCount / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetCount) {
                setCount(targetCount);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);
        
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full min-h-screen">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                <img 
                    src="/images/font_3.jpg" 
                    alt="Haiti Background"
                    className="w-full h-full object-cover"
                />
                <div 
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(0, 0, 35, 0.3) 0%, rgba(0, 0, 35, 0.95) 70%)',
                    }}
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex items-center justify-center w-full min-h-screen py-12 px-4">
                <div className="container max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        {/* Left Column - Text Content */}
                        <div className="w-full lg:w-1/2 space-y-8">
                            <h1 className="text-white text-4xl md:text-6xl font-bold">
                                Mission Haiti
                            </h1>
                            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-blue-500" />
                            <p className="text-white text-lg md:text-xl max-w-xl">
                                Serving communities in Haiti through faith, education, and humanitarian aid. Join us in making a difference in the lives of Haitian families.
                            </p>
                            <button className="bg-yellow-300 hover:bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors">
                                <span>Explorer</span>
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

                        {/* Right Column - Map and Stats */}
                        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center gap-6">
                            <div className="relative w-full max-w-md aspect-square">
                                <img 
                                    src="/aa.png" 
                                    alt="Haiti Map" 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white w-full max-w-sm">
                                <div className="text-center space-y-2">
                                    <p className="text-4xl md:text-5xl font-bold">{count}</p>
                                    <p className="text-lg md:text-xl">Enfants Touchés</p>
                                </div>
                            </div>
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
