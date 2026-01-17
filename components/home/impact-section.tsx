"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { CMSText } from '../cms/cms-text';
import dynamic from 'next/dynamic';

// Dynamic import for Map to avoid SSR issues
const ImpactMap = dynamic(() => import('./impact-map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-zinc-800 animate-pulse flex items-center justify-center text-zinc-500">Chargement de la carte...</div>
});

const COUNTRIES_DATA = [
    { code: 'CA', name: 'Canada', coords: [56.13, -106.34], defaultStat: "45,000" },
    { code: 'GF', name: 'Guyane Française', coords: [3.93, -53.12], defaultStat: "2,500" },
    { code: 'GP', name: 'Guadeloupe', coords: [16.26, -61.55], defaultStat: "5,500" },
    { code: 'HT', name: 'Haïti', coords: [18.97, -72.28], defaultStat: "156,000" },
    { code: 'MQ', name: 'Martinique', coords: [14.64, -61.02], defaultStat: "4,200" },
    { code: 'MF', name: 'Saint Martin', coords: [18.07, -63.05], defaultStat: "1,200" },
    { code: 'SX', name: 'Sint Maarten', coords: [18.04, -63.05], defaultStat: "1,100" },
];

const ACTIVITIES_DATA = [
    { id: "gnc", title: "Club de la Bonne Nouvelle", desc: "Clubs bibliques hebdomadaires organisés dans les écoles et quartiers.", icon: "🏫", color: "text-yellow-400", border: "border-yellow-500/30" },
    { id: "5dc", title: "Club de 5 Jours", desc: "Programmes d'été missionnaires sur 5 jours consécutifs.", icon: "☀️", color: "text-orange-400", border: "border-orange-500/30" },
    { id: "jyc", title: "JYC", desc: "Connexion Jeunesse pour les adolescents et collégiens.", icon: "🎒", color: "text-blue-400", border: "border-blue-500/30" },
    { id: "train", title: "Formation des Enseignants", desc: "Équiper les croyants pour enseigner efficacement aux enfants.", icon: "🎓", color: "text-purple-400", border: "border-purple-500/30" },
    { id: "cpc", title: "Club de Noël", desc: "Événements ponctuels partageant le vrai sens de Noël.", icon: "🎄", color: "text-green-400", border: "border-green-500/30" },
    { id: "tcc", title: "Chercheurs de Vérité", desc: "Leçons bibliques par correspondance pour le discipulat.", icon: "📬", color: "text-red-400", border: "border-red-500/30" },
];

// Icons for navigation
const IconArrowLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>;
const IconArrowRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;

const ImpactSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });
  
  // TRACE: Monitoring de la vue
  useEffect(() => {
    console.log(`[View] ImpactSection is currently in view: ${isInView}`);
  }, [isInView]);

  const [activeTab, setActiveTab] = useState<'child' | 'nation' | 'day'>('child');
  const [activeCountryIndex, setActiveCountryIndex] = useState(0);
  const [activeActivityIndex, setActiveActivityIndex] = useState(0);

  // Tab Orchestration
  useEffect(() => {
    if (!isInView) return;
    console.info("[Orchestration] ImpactSection: Starting 5s timer to 'nation'...");

    const toNation = setTimeout(() => {
      console.info("[Orchestration] ImpactSection: Switching to 'nation'");
      setActiveTab(prev => prev === 'child' ? 'nation' : prev);
    }, 5000);

    const toDay = setTimeout(() => {
      console.info("[Orchestration] ImpactSection: Switching to 'day' (2min mark)");
      setActiveTab(prev => prev === 'nation' ? 'day' : prev);
    }, 120000);

    return () => {
      clearTimeout(toNation);
      clearTimeout(toDay);
    };
  }, [isInView]);

  // Auto-rotate countries - Only when section is in view
  useEffect(() => {
    if (activeTab !== 'nation' || !isInView) return;
    
    const interval = setInterval(() => {
      setActiveCountryIndex((prev) => (prev + 1) % COUNTRIES_DATA.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeTab, isInView]);

  // Auto-scroll logic for country list - Protected by isInView to avoid page jumping
  useEffect(() => {
    if (activeTab === 'nation' && isInView) {
        const el = document.getElementById(`country-item-${activeCountryIndex}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
  }, [activeCountryIndex, activeTab, isInView]);

  // Activity Navigation
  const nextActivity = () => {
    setActiveActivityIndex((prev) => (prev + 1) % ACTIVITIES_DATA.length);
  };

  const prevActivity = () => {
    setActiveActivityIndex((prev) => (prev - 1 + ACTIVITIES_DATA.length) % ACTIVITIES_DATA.length);
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  // Adjusted padding and height class to fits within viewport accounting for header
  return (
    <section ref={sectionRef} className="relative bg-zinc-900 text-white overflow-hidden flex flex-col justify-center min-h-[calc(100vh-65px)] scroll-mt-16" id="ministries">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col h-full py-4 md:py-8 justify-center">
            
            {/* Header: Ministeres */}
            <div className="text-center mb-2 md:mb-4 shrink-0">
                <span className="inline-block px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold tracking-wider uppercase">
                    <CMSText k="home.ministries.badge" defaultVal="Nos Ministères" />
                </span>
            </div>

            {/* Interactive Slogan Navigation - Compact sizes */}
            <div className="flex flex-wrap justify-center items-baseline gap-2 md:gap-3 mb-6 md:mb-8 text-xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-center shrink-0">
                <span className="text-zinc-600">
                    <CMSText k="home.slogan.prefix" defaultVal="Nous servons" />
                </span>
                
                <button 
                    onClick={() => setActiveTab('child')}
                    className={`transition-all duration-300 relative group px-2 outline-none ${activeTab === 'child' ? 'scale-105' : 'hover:opacity-80'}`}
                >
                    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 ${activeTab === 'child' ? 'opacity-100' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100'}`}>
                        <CMSText k="home.slogan.word1" defaultVal="Chaque Enfant" />
                    </span>
                    {activeTab === 'child' && <motion.div layoutId="underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />}
                </button>

                <span className="text-zinc-700">,</span>

                <button 
                    onClick={() => setActiveTab('nation')}
                    className={`transition-all duration-300 relative group px-2 outline-none ${activeTab === 'nation' ? 'scale-105' : 'hover:opacity-80'}`}
                >
                    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300 ${activeTab === 'nation' ? 'opacity-100' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100'}`}>
                        <CMSText k="home.slogan.word2" defaultVal="Chaque Nation" />
                    </span>
                    {activeTab === 'nation' && <motion.div layoutId="underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-500 rounded-full" />}
                </button>

                <span className="text-zinc-700">,</span>

                <button 
                    onClick={() => setActiveTab('day')}
                    className={`transition-all duration-300 relative group px-2 outline-none ${activeTab === 'day' ? 'scale-105' : 'hover:opacity-80'}`}
                >
                    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-300 ${activeTab === 'day' ? 'opacity-100' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100'}`}>
                        <CMSText k="home.slogan.word3" defaultVal="Chaque Jour" />
                    </span>
                    {activeTab === 'day' && <motion.div layoutId="underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-500 rounded-full" />}
                </button>
            </div>

            {/* Content Area - Responsive Fill */}
            <div className="flex-1 relative min-h-[350px] md:h-auto overflow-hidden">
                <AnimatePresence mode="wait">
                    {activeTab === 'nation' && (
                        <motion.div 
                            key="nation"
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl flex flex-col md:flex-row h-full absolute inset-0 md:static md:h-[55vh] max-h-[600px]"
                        >
                            {/* Left Side: Country List */}
                            <div className="w-full md:w-1/3 bg-zinc-900/50 p-4 overflow-y-auto border-r border-zinc-700 custom-scrollbar scroll-smooth">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 sticky top-0 bg-zinc-900/90 backdrop-blur-sm py-2 z-10 -mx-2 px-2 border-b border-zinc-800">
                                    <span className="text-green-500">🌍</span> 
                                    <CMSText k="home.impact.list_title" defaultVal="Zones d'Impact" />
                                </h3>
                                <div className="space-y-1.5">
                                    {COUNTRIES_DATA.map((country, idx) => (
                                        <div 
                                            key={country.code}
                                            id={`country-item-${idx}`}
                                            onClick={() => setActiveCountryIndex(idx)}
                                            className={`
                                                flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-300 border
                                                ${activeCountryIndex === idx 
                                                    ? 'bg-zinc-800 border-green-500/50 shadow-lg transform scale-102' 
                                                    : 'bg-transparent border-transparent hover:bg-zinc-800/50 hover:border-zinc-700'
                                                }
                                            `}
                                        >
                                            <img 
                                                src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`} 
                                                alt={country.name}
                                                className="w-8 h-8 rounded-full object-cover border border-zinc-600"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className={`font-bold text-sm truncate ${activeCountryIndex === idx ? 'text-white' : 'text-zinc-400'}`}>
                                                    {country.name}
                                                </div>
                                                {activeCountryIndex === idx && (
                                                    <motion.div 
                                                        initial={{ opacity: 0 }} 
                                                        animate={{ opacity: 1 }} 
                                                        className="text-xs text-green-400 font-mono mt-0.5"
                                                    >
                                                        <CMSText k={`impact.stat.${country.code.toLowerCase()}`} defaultVal={country.defaultStat} /> <CMSText k="home.impact.stat_unit" defaultVal="enfants" />
                                                    </motion.div>
                                                )}
                                            </div>
                                            {activeCountryIndex === idx && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Side: Map */}
                            <div className="w-full md:w-2/3 relative h-full bg-zinc-900">
                                <ImpactMap 
                                    regionData={COUNTRIES_DATA} 
                                    activeRegionIndex={activeCountryIndex} 
                                />
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'child' && (
                        <motion.div 
                            key="child"
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-zinc-800/20 backdrop-blur rounded-2xl p-4 md:p-8 border border-zinc-700/50 h-full md:h-[55vh] max-h-[600px] flex items-center justify-center"
                        >
                             <div className="max-w-3xl text-center w-full">
                                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full mb-6"></div>
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                                    <CMSText k="home.impact.verse_text" defaultVal='"Ce n est pas la volonté de votre Père qui est dans les cieux qu un seul de ces petits périsse."' />
                                </h3>
                                <p className="text-blue-400 text-lg md:text-xl font-serif italic mb-8">
                                    — <CMSText k="home.impact.verse_ref" defaultVal="Matthieu 18:14" />
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
                                    <div className="bg-zinc-900/80 p-4 rounded-xl border border-blue-500/30 shadow-lg">
                                        <div className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white mb-1">
                                            <CMSText k="home.impact.stat_reached" defaultVal="2.4M" />
                                        </div>
                                        <div className="text-[10px] md:text-xs text-blue-200 uppercase tracking-widest font-bold">
                                            <CMSText k="home.impact.stat_label_reached" defaultVal="Enfants Touchés" />
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-700 shadow-lg">
                                        <div className="text-3xl md:text-4xl font-extrabold text-zinc-500 mb-1">
                                            <CMSText k="home.impact.stat_goal" defaultVal="3M" />
                                        </div>
                                        <div className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest font-bold">
                                            <CMSText k="home.impact.stat_label_goal" defaultVal="Objectif 2025" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/*  Day Tab - Carousel Implementation */}
                    {activeTab === 'day' && (
                        <motion.div 
                            key="day"
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="h-full md:h-[60vh] max-h-[700px] w-full relative group"
                        >
                            {/* Navigation Buttons (Right Side) */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 p-2 bg-zinc-900/50 backdrop-blur-sm rounded-l-xl border-l border-y border-zinc-700 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity translate-x-full group-hover:translate-x-0 duration-300">
                                <button 
                                    onClick={prevActivity}
                                    className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors border border-zinc-600 shadow-md"
                                    aria-label="Previous"
                                >
                                    <IconArrowLeft />
                                </button>
                                <button 
                                    onClick={nextActivity}
                                    className="p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors border border-zinc-600 shadow-md"
                                    aria-label="Next"
                                >
                                    <IconArrowRight />
                                </button>
                            </div>

                            {/* Carousel Track */}
                            <div className="w-full h-full flex items-center justify-end md:justify-center overflow-hidden relative py-12 md:py-0">
                                <motion.div 
                                    className="flex items-center gap-6 absolute left-1/2"
                                    animate={{ 
                                        x: `calc(-160px - ${activeActivityIndex * 344}px)` // Center active item carefully
                                    }}
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                    {ACTIVITIES_DATA.map((activity, i) => {
                                        const isActive = i === activeActivityIndex;
                                        return (
                                            <motion.div 
                                                key={i} 
                                                animate={{ 
                                                    scale: isActive ? 1 : 0.85,
                                                    opacity: isActive ? 1 : 0.4,
                                                    filter: isActive ? 'grayscale(0%)' : 'grayscale(100%) blur(1px)',
                                                    zIndex: isActive ? 10 : 0
                                                }}
                                                className={`
                                                    w-[320px] shrink-0 bg-zinc-800 p-6 rounded-2xl border ${isActive ? activity.border : 'border-zinc-700'} 
                                                    flex flex-col items-start shadow-xl h-[380px] justify-between transition-colors cursor-pointer
                                                    hover:border-zinc-500
                                                `}
                                                onClick={() => setActiveActivityIndex(i)}
                                            >
                                                <div className="w-full pointer-events-none">
                                                    <div className={`text-5xl mb-6 w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner ${isActive ? 'bg-zinc-900' : 'bg-transparent transition-colors duration-500'}`}>
                                                        {activity.icon}
                                                    </div>
                                                    <h4 className={`text-2xl font-bold mb-4 leading-tight ${activity.color}`}>
                                                        <CMSText k={`home.impact.activities.${activity.id}.title`} defaultVal={activity.title} />
                                                    </h4>
                                                    <div className="w-10 h-1 bg-zinc-700 rounded-full mb-4"></div>
                                                    <p className="text-zinc-300 text-base leading-relaxed line-clamp-3">
                                                        <CMSText k={`home.impact.activities.${activity.id}.desc`} defaultVal={activity.desc} />
                                                    </p>
                                                </div>
                                                <div className={`w-full py-2 text-xs font-bold uppercase tracking-wider ${isActive ? activity.color : 'text-zinc-600'}`}>
                                                    <CMSText k="home.impact.read_more" defaultVal="En Savoir Plus" /> →
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            </div>

                            {/* Mobile Indicators */}
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:hidden">
                                {ACTIVITIES_DATA.map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`h-1.5 rounded-full transition-all ${i === activeActivityIndex ? 'w-6 bg-white' : 'w-1.5 bg-zinc-600'}`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    </section>
  );
};

export default ImpactSection;
