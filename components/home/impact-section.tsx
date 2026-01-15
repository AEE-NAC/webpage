"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CMSText } from '../cms/cms-text';
import dynamic from 'next/dynamic';

// Dynamic import the entire Map component to ensure context integrity
const ImpactMap = dynamic(() => import('./impact-map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-zinc-800 animate-pulse flex items-center justify-center text-zinc-500">Loading Map...</div>
});

interface RegionCountry {
    name: string;
    coords: [number, number];
    childrenReached: number;
}

// Coordinates for Americas/Caribbean regions
const REGION_DATA: RegionCountry[] = [
    { name: 'Haiti', coords: [18.9712, -72.2852], childrenReached: 156000 },
    { name: 'Canada', coords: [56.1304, -106.3468], childrenReached: 45000 },
    { name: 'USA', coords: [37.0902, -95.7129], childrenReached: 890000 },
    { name: 'Dominican Rep.', coords: [18.7357, -70.1627], childrenReached: 62000 },
    { name: 'Jamaica', coords: [18.1096, -77.2975], childrenReached: 21000 },
    { name: 'Guadeloupe', coords: [16.2650, -61.5510], childrenReached: 5500 },
];

const ImpactSection = () => {
  const [activeTab, setActiveTab] = useState<'child' | 'nation' | 'day'>('nation');

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <section className="py-20 bg-zinc-900 text-white overflow-hidden">
        <div className="container mx-auto px-4">
            {/* Header Slogan Navigation */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 mb-16 text-3xl md:text-5xl font-extrabold tracking-tight">
                <button 
                    onClick={() => setActiveTab('child')}
                    className={`transition-all duration-300 flex items-center gap-3 ${activeTab === 'child' ? 'text-blue-400 scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                        <CMSText k="home.impact.tab.child" defaultVal="Every Child" />
                    </span>
                </button>
                <button 
                    onClick={() => setActiveTab('nation')}
                    className={`transition-all duration-300 flex items-center gap-3 ${activeTab === 'nation' ? 'text-green-400 scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
                        <CMSText k="home.impact.tab.nation" defaultVal="Every Nation" />
                    </span>
                </button>
                <button 
                    onClick={() => setActiveTab('day')}
                    className={`transition-all duration-300 flex items-center gap-3 ${activeTab === 'day' ? 'text-yellow-400 scale-110' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-300">
                        <CMSText k="home.impact.tab.day" defaultVal="Every Day" />
                    </span>
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px] relative">
                <AnimatePresence mode="wait">
                    {activeTab === 'nation' && (
                        <motion.div 
                            key="nation"
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full h-[500px] rounded-3xl overflow-hidden border border-zinc-700 shadow-2xl relative"
                        >
                            <div className="absolute top-4 left-4 z-[500] bg-zinc-900/90 backdrop-blur p-4 rounded-xl border border-zinc-700 max-w-sm pointer-events-none select-none">
                                <h3 className="text-xl font-bold text-green-400 mb-1">
                                    <CMSText k="home.impact.map.title" defaultVal="Regional Impact" />
                                </h3>
                                <p className="text-sm text-zinc-300">
                                    <CMSText k="home.impact.map.subtitle" defaultVal="Click markers to see children reached in our active regions." />
                                </p>
                            </div>
                            <ImpactMap regionData={REGION_DATA} />
                        </motion.div>
                    )}

                    {activeTab === 'child' && (
                        <motion.div 
                            key="child"
                            variants={variants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="flex flex-col items-center justify-center h-full py-10"
                        >
                            <div className="max-w-2xl text-center space-y-8">
                                <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
                                <h3 className="text-3xl font-bold text-white">
                                    <CMSText k="home.impact.verse_text" defaultVal='"It is not the will of your Father which is in heaven, that one of these little ones should perish."' />
                                </h3>
                                <p className="text-blue-400 text-xl font-mono">
                                    <CMSText k="home.impact.verse_ref" defaultVal="Matthew 18:14" />
                                </p>
                                
                                <div className="grid grid-cols-2 gap-8 mt-12 bg-zinc-800/50 p-8 rounded-2xl border border-zinc-700">
                                    <div>
                                        <div className="text-5xl font-bold text-white mb-2">
                                            <CMSText k="home.impact.stat_reached" defaultVal="2.4M" />
                                        </div>
                                        <div className="text-sm text-zinc-400 uppercase tracking-widest">
                                            <CMSText k="home.impact.stat_label_reached" defaultVal="Children Reached" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-5xl font-bold text-white mb-2">
                                            <CMSText k="home.impact.stat_goal" defaultVal="3M" />
                                        </div>
                                        <div className="text-sm text-zinc-400 uppercase tracking-widest">
                                            <CMSText k="home.impact.stat_label_goal" defaultVal="Goal 2025" />
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
                            className="bg-zinc-800/30 rounded-3xl p-8 border border-zinc-700 h-full"
                        >
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                                {[
                                    { id: "gnc", title: "Good News Club", desc: "Weekly Bible clubs held in schools, homes, and community centers.", icon: "🏫", color: "text-yellow-400" },
                                    { id: "5dc", title: "5-Day Club", desc: "Summer missionary outreach programs held over 5 consecutive days.", icon: "☀️", color: "text-orange-400" },
                                    { id: "tcc", title: "Truth Chasers Club", desc: "Mail-based Bible lessons discipling children remotely.", icon: "📬", color: "text-red-400" },
                                    { id: "jyc", title: "JYC", desc: "Junior Youth Connection for teenagers/middle schoolers.", icon: "🎒", color: "text-blue-400" },
                                    { id: "train", title: "Teacher Training", desc: "Equipping believers to effectively teach children.", icon: "🎓", color: "text-purple-400" },
                                    { id: "cpc", title: "Christmas Party Club", desc: "One-time outreach events sharing the true meaning of Christmas.", icon: "🎄", color: "text-green-400" }
                                ].map((activity, i) => (
                                    <div key={i} className="bg-zinc-800 p-6 rounded-xl border border-zinc-700 hover:bg-zinc-700/80 transition-colors flex flex-col items-start">
                                        <div className="text-4xl mb-4">{activity.icon}</div>
                                        <h4 className={`text-xl font-bold mb-2 ${activity.color}`}>
                                            <CMSText k={`home.impact.activities.${activity.id}.title`} defaultVal={activity.title} />
                                        </h4>
                                        <p className="text-zinc-400 text-sm">
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
