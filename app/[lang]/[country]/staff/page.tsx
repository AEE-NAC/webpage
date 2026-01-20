"use client";

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CMSText } from '@/components/cms/cms-text';
import { CMSImage } from '@/components/cms/cms-image';
import { useParams } from 'next/navigation';

export default function CountryStaffPage() {
    const params = useParams();
    const country = (params?.country as string || '').toUpperCase();

    // In a real app, fetch staff filtered by country here from Supabase
    // For now, we simulate country specific leadership structure via CMS keys

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header />
            
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 bg-zinc-50 overflow-hidden">
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wide mb-4 flex items-center gap-2 w-fit mx-auto">
                            <img src={`https://flagcdn.com/w20/${country.toLowerCase()}.png`} className="w-4 h-3 rounded-[2px]" alt="Flag"/>
                            <span>Leadership National</span>
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mb-4 drop-shadow-sm">
                            <CMSText k="country.staff.title" defaultVal={`Notre Équipe en ${country}`} />
                        </h1>
                        <p className="text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                            <CMSText k="country.staff.subtitle" defaultVal="Rencontrez les hommes et les femmes qui portent la vision dans cette nation." />
                        </p>
                    </div>
                </section>

                {/* Staff Grid - Simplified for Country context */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col items-center gap-12">
                            
                            {/* National Director - Highlighted */}
                            <div className="flex flex-col items-center">
                                <div className="w-64 h-64 relative rounded-full overflow-hidden shadow-xl border-4 border-white mb-6">
                                    <CMSImage 
                                        k="country.staff.director.image"
                                        defaultSrc="https://placehold.co/400x400/981a3c/ffffff?text=Director"
                                        alt="Director"
                                        className="w-full h-full object-cover"
                                        fill
                                    />
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-900"><CMSText k="country.staff.director.name" defaultVal="Directeur National" /></h2>
                                <h3 className="text-[#981a3c] font-bold uppercase tracking-widest text-sm"><CMSText k="country.staff.director.role" defaultVal="Leadership" /></h3>
                            </div>

                            <div className="w-full h-px bg-zinc-200 max-w-2xl"></div>

                            {/* Board / Committee Grid */}
                            <div className="w-full max-w-5xl">
                                <h3 className="text-center text-xl font-bold mb-8 text-zinc-400">Comité National</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex flex-col items-center text-center">
                                            <div className="w-24 h-24 rounded-full bg-zinc-100 mb-3 overflow-hidden">
                                                <CMSImage k={`country.staff.member${i}.image`} defaultSrc={`https://placehold.co/200x200?text=${i}`} alt="Member" className="w-full h-full object-cover" width={100} height={100} />
                                            </div>
                                            <div className="font-bold text-zinc-800 text-sm"><CMSText k={`country.staff.member${i}.name`} defaultVal="Membre Comité" /></div>
                                            <div className="text-xs text-zinc-500"><CMSText k={`country.staff.member${i}.role`} defaultVal="Fonction" /></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
