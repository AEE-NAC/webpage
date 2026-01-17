"use client";

import React, { useState, useMemo } from "react";
import { SupportedLanguage } from "@/context/adapt";
import Link from "next/link";
import { CMSText } from "@/components/cms/cms-text";
import { CMSImage } from "@/components/cms/cms-image";
import { CMSWeeklyWord, CMSNewsletter } from "@/services/types";

const formatDate = (dateString: string, lang: string) => {
    return new Date(dateString).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' });
}

const FilterBar = ({ selectedYear, onYearChange, years, label }: { selectedYear: string, onYearChange: (y: string) => void, years: string[], label: string }) => (
    <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
        <select 
            value={selectedYear} 
            onChange={(e) => onYearChange(e.target.value)}
            className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1 text-sm font-medium focus:ring-2 focus:ring-[#981a3c] outline-none transition-all"
        >
            <option value="all">Toutes les années</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
    </div>
);

export function WeeklyWordFeed({ lang, initialWords }: { lang: SupportedLanguage, initialWords: CMSWeeklyWord[] }) {
   console.log(`[Component] WeeklyWordFeed: Rendered with ${initialWords?.length || 0} initial words.`);
   const [year, setYear] = useState('all');
   
   const years = useMemo(() => {
       const yrs = initialWords.map(w => new Date(w.start_date || '').getFullYear().toString());
       return Array.from(new Set(yrs)).sort().reverse();
   }, [initialWords]);

   const filteredWords = initialWords.filter(w => year === 'all' || new Date(w.start_date || '').getFullYear().toString() === year);

   if (!initialWords.length) return null;

   return (
     <section className="w-full max-w-5xl mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#981a3c] rounded-full"></span>
                <CMSText k="home.weekly_words.title" defaultVal="Paroles de la Semaine" />
            </h2>
            <FilterBar selectedYear={year} onYearChange={setYear} years={years} label="Filtrer par" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredWords.slice(0, 6).map(w => (
                <Link key={w.id} href={`/${lang}/weekly-word/${w.id}`} className="group block h-full">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#981a3c]/50 transition-all h-full flex flex-col">
                        <div className="h-48 w-full bg-zinc-100 relative overflow-hidden">
                             {w.image_url ? (
                                 <img src={w.image_url} alt={w.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                             ) : (
                                 <div className="w-full h-full flex items-center justify-center text-zinc-300 bg-zinc-50 dark:bg-zinc-800">
                                     <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                 </div>
                             )}
                             <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-[#981a3c] shadow-sm">
                                 {formatDate(w.start_date, lang)}
                             </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-[#981a3c] transition-colors">{w.title}</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-3 mb-4">{w.content?.replace(/<[^>]*>?/gm, '')}</p> 
                            <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-sm">
                                <span className="font-medium text-zinc-900 dark:text-zinc-200">{w.author_name}</span>
                                <span className="text-[#981a3c] font-medium group-hover:underline flex items-center gap-1">Read <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
     </section>
   )
}

export function NewsletterFeed({ lang, initialNewsletters }: { lang: SupportedLanguage, initialNewsletters: CMSNewsletter[] }) {
    console.log(`[Component] NewsletterFeed: Rendered with ${initialNewsletters?.length || 0} initial newsletters.`);
    const [year, setYear] = useState('all');

    const years = useMemo(() => {
        const yrs = initialNewsletters.map(n => new Date(n.publication_date).getFullYear().toString());
        return Array.from(new Set(yrs)).sort().reverse();
    }, [initialNewsletters]);

    const filtered = initialNewsletters.filter(n => year === 'all' || new Date(n.publication_date).getFullYear().toString() === year);

    if (!initialNewsletters.length) return null;

    return (
        <section className="w-full max-w-5xl mx-auto py-12 px-4 my-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                    <span className="w-2 h-6 bg-green-600 rounded-full"></span>
                    <CMSText k="home.newsletters.title" defaultVal="Archives Newsletters" />
                </h2>
                <FilterBar selectedYear={year} onYearChange={setYear} years={years} label="Archives de" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {filtered.slice(0, 8).map(n => (
                     <a key={n.id} href={n.pdf_url} target="_blank" rel="noopener noreferrer" className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-xl hover:border-green-500/50 transition-all duration-300">
                         <div className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center relative group-hover:bg-green-50 transition-colors">
                             <div className="w-16 h-20 bg-white border-2 border-zinc-200 rounded-md shadow-sm transform group-hover:-rotate-3 group-hover:scale-110 transition-all flex flex-col items-center justify-center">
                                 <span className="text-[10px] font-black text-red-600 mb-1">PDF</span>
                                 <svg className="w-8 h-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                             </div>
                             <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/5 to-transparent"></div>
                         </div>
                         <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
                             <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-green-600 line-clamp-1">{n.title}</h4>
                             <p className="text-[10px] uppercase font-bold text-zinc-400 mt-1">{formatDate(n.publication_date, lang)}</p>
                         </div>
                     </a>
                 ))}
             </div>
        </section>
    )
}

export function DirectorGreeting() {
    return (
        <section className="w-full bg-[#981a3c] text-white py-16 px-4 mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-12"></div>
            <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-12 relative z-10">
                <div className="w-full md:w-1/3 flex justify-center md:justify-end">
                    <div className="w-64 h-64 relative">
                        <div className="absolute inset-0 border-4 border-white/20 rounded-full transform -translate-x-4 translate-y-4"></div>
                        <CMSImage 
                            k="home.director.image" 
                            defaultSrc="https://i.pravatar.cc/300?img=11" 
                            alt="Director" 
                            className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white"
                            width={300}
                            height={300}
                        />
                    </div>
                </div>
                <div className="w-full md:w-2/3 text-center md:text-left space-y-6">
                    <div>
                        <span className="text-pink-200 font-bold uppercase tracking-wider text-sm mb-2 block">
                            <CMSText k="home.director.subtitle" defaultVal="A Message from our Director" />
                        </span>
                        <h2 className="text-4xl font-bold font-serif">
                            <CMSText k="home.director.title" defaultVal="Welcome to a New Season" />
                        </h2>
                    </div>
                    <div className="text-lg text-pink-50 leading-relaxed font-light">
                        <CMSText 
                            as="div"
                            k="home.director.message" 
                            defaultVal="It is my joy to welcome you to our community. As we look forward to what God is doing in the lives of children across our region, we invite you to join us in prayer and continuous support." 
                        />
                    </div>
                    <CMSImage 
                        k="home.director.signature"
                        defaultSrc="/signature.png" // User must provide a placeholder if this doesn't exist, generic placeholder used
                        alt="Signature"
                        className="h-12 w-auto opacity-80 mx-auto md:mx-0 invert filter brightness-0"
                        width={150}
                        height={60}
                    />
                </div>
            </div>
        </section>
    );
}
