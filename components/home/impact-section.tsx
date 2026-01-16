"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const ImpactSection = () => {
  const [activeTab, setActiveTab] = useState<'child' | 'nation' | 'day'>('nation');
  const [activeCountryIndex, setActiveCountryIndex] = useState(0);

  // Auto-rotate countries
  useEffect(() => {
    if (activeTab !== 'nation') return;
    
    const interval = setInterval(() => {
      setActiveCountryIndex((prev) => (prev + 1) % COUNTRIES_DATA.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [activeTab]);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <section className="py-24 bg-zinc-900 text-white overflow-hidden relative" id="ministries">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
            
            {/* Header: Ministeres */}
            <div className="text-center mb-8">
                <span className="inline-block px-4 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-semibold tracking-wider uppercase mb-4">
                    <CMSText k="home.ministries.badge" defaultVal="Nos Ministères" />
                </span>
            </div>

            {/* Interactive Slogan Navigation */}
            <div className="flex flex-wrap justify-center items-baseline gap-2 md:gap-4 mb-20 text-3xl md:text-6xl font-extrabold tracking-tight leading-tight text-center">
                <span className="text-zinc-600">
                    <CMSText k="home.slogan.prefix" defaultVal="Nous servons" />
                </span>
                
                <button 
                    onClick={() => setActiveTab('child')}
                    className={`transition-all duration-300 relative group px-2 ${activeTab === 'child' ? 'scale-110' : 'hover:opacity-80'}`}
                >
                    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 ${activeTab === 'child' ? 'opacity-100' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100'}`}>
                        <CMSText k="home.slogan.word1" defaultVal="Chaque Enfant" />
                    </span>
                    {activeTab === 'child' && <motion.div layoutId="underline" className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-500 rounded-full" />}
                </button>

                <span className="text-zinc-700">,</span>

                <button 
                    onClick={() => setActiveTab('nation')}
                    className={`transition-all duration-300 relative group px-2 ${activeTab === 'nation' ? 'scale-110' : 'hover:opacity-80'}`}
                >
                    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300 ${activeTab === 'nation' ? 'opacity-100' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100'}`}>
                        <CMSText k="home.slogan.word2" defaultVal="Chaque Nation" />
                    </span>
                    {activeTab === 'nation' && <motion.div layoutId="underline" className="absolute -bottom-2 left-0 right-0 h-1 bg-green-500 rounded-full" />}
                </button>

                <span className="text-zinc-700">,</span>

                <button 
                    onClick={() => setActiveTab('day')}
                    className={`transition-all duration-300 relative group px-2 ${activeTab === 'day' ? 'scale-110' : 'hover:opacity-80'}`}
                >
                    <span className={`bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-300 ${activeTab === 'day' ? 'opacity-100' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100'}`}>
                        <CMSText k="home.slogan.word3" defaultVal="Chaque Jour" />
                    </span>
                    {activeTab === 'day' && <motion.div layoutId="underline" className="absolute -bottom-2 left-0 right-0 h-1 bg-yellow-500 rounded-full" />}
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[600px] relative">
                <AnimatePresence mode="wait">
                    {activeTab === 'nation' && (
                        <motion.div 
                            key="nation"
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-zinc-800 rounded-3xl overflow-hidden border border-zinc-700 shadow-2xl flex flex-col md:flex-row h-[600px]"
                        >
                            {/* Left Side: Country List */}
                            <div className="w-full md:w-1/3 bg-zinc-900/50 p-6 overflow-y-auto border-r border-zinc-700">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="text-green-500">🌍</span> 
                                    <CMSText k="home.impact.list_title" defaultVal="Zones d'Impact" />
                                </h3>
                                <div className="space-y-2">
                                    {COUNTRIES_DATA.map((country, idx) => (
                                        <div 
                                            key={country.code}
                                            onClick={() => setActiveCountryIndex(idx)}
                                            className={`
                                                flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 border
                                                ${activeCountryIndex === idx 
                                                    ? 'bg-zinc-800 border-green-500/50 shadow-lg transform scale-102' 
                                                    : 'bg-transparent border-transparent hover:bg-zinc-800/50 hover:border-zinc-700'
                                                }
                                            `}
                                        >
                                            <img 
                                                src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`} 
                                                alt={country.name}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-zinc-600"
                                            />
                                            <div className="flex-1">
                                                <div className={`font-bold ${activeCountryIndex === idx ? 'text-white' : 'text-zinc-400'}`}>
                                                    {country.name}
                                                </div>
                                                {activeCountryIndex === idx && (
                                                    <motion.div 
                                                        initial={{ opacity: 0 }} 
                                                        animate={{ opacity: 1 }} 
                                                        className="text-sm text-green-400 font-mono mt-0.5"
                                                    >
                                                        <CMSText k={`impact.stat.${country.code.toLowerCase()}`} defaultVal={country.defaultStat} /> <CMSText k="home.impact.stat_unit" defaultVal="enfants" />
                                                    </motion.div>
                                                )}
                                            </div>
                                            {activeCountryIndex === idx && (
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Side: Map */}
                            <div className="w-full md:w-2/3 relative h-full">
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
                            className="bg-zinc-800/20 backdrop-blur rounded-3xl p-10 border border-zinc-700/50 h-[600px] flex items-center justify-center"
                        >
                            <div className="max-w-3xl text-center">
                                <div className="w-20 h-2 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full mb-10"></div>
                                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                    <CMSText k="home.impact.verse_text" defaultVal='"Ce n est pas la volonté de votre Père qui est dans les cieux qu un seul de ces petits périsse."' />
                                </h3>
                                <p className="text-blue-400 text-2xl font-serif italic mb-12">
                                    — <CMSText k="home.impact.verse_ref" defaultVal="Matthieu 18:14" />
                                </p>
                                
                                <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
                                    <div className="bg-zinc-900/80 p-6 rounded-2xl border border-blue-500/30">
                                        <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white mb-2">
                                            <CMSText k="home.impact.stat_reached" defaultVal="2.4M" />
                                        </div>
                                        <div className="text-xs text-blue-200 uppercase tracking-widest font-bold">
                                            <CMSText k="home.impact.stat_label_reached" defaultVal="Enfants Touchés" />
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-700">
                                        <div className="text-5xl font-extrabold text-zinc-500 mb-2">
                                            <CMSText k="home.impact.stat_goal" defaultVal="3M" />
                                        </div>
                                        <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
                                            <CMSText k="home.impact.stat_label_goal" defaultVal="Objectif 2025" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'day' && (
                        <motion.div 
                            key="day"
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="h-[600px] p-2"
                        >
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full overflow-y-auto pb-4">
                                {[
                                    { id: "gnc", title: "Club de la Bonne Nouvelle", desc: "Clubs bibliques hebdomadaires organisés dans les écoles et quartiers.", icon: "🏫", color: "text-yellow-400", border: "border-yellow-500/30" },
                                    { id: "5dc", title: "Club de 5 Jours", desc: "Programmes d'été missionnaires sur 5 jours consécutifs.", icon: "☀️", color: "text-orange-400", border: "border-orange-500/30" },
                                    { id: "jyc", title: "JYC", desc: "Connexion Jeunesse pour les adolescents et collégiens.", icon: "🎒", color: "text-blue-400", border: "border-blue-500/30" },
                                    { id: "train", title: "Formation des Enseignants", desc: "Équiper les croyants pour enseigner efficacement aux enfants.", icon: "🎓", color: "text-purple-400", border: "border-purple-500/30" },
                                    { id: "cpc", title: "Club de Noël", desc: "Événements ponctuels partageant le vrai sens de Noël.", icon: "🎄", color: "text-green-400", border: "border-green-500/30" },
                                    { id: "tcc", title: "Chercheurs de Vérité", desc: "Leçons bibliques par correspondance pour le discipulat.", icon: "📬", color: "text-red-400", border: "border-red-500/30" },
                                ].map((activity, i) => (
                                    <div key={i} className={`bg-zinc-800 p-8 rounded-2xl border ${activity.border} hover:bg-zinc-700/80 transition-all hover:-translate-y-1 duration-300 flex flex-col items-start shadow-lg`}>
                                        <div className="text-5xl mb-6 bg-zinc-900 w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner">{activity.icon}</div>
                                        <h4 className={`text-xl font-bold mb-3 ${activity.color}`}>
                                            <CMSText k={`home.impact.activities.${activity.id}.title`} defaultVal={activity.title} />
                                        </h4>
                                        <p className="text-zinc-400 leading-relaxed">
                                            <CMSText k={`home.impact.activities.${activity.id}.desc`} defaultVal={activity.desc} />
                                        </p>
                                    </div>
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
