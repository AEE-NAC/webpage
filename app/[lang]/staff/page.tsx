"use client";

import React from 'react';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { CMSText } from '../../../components/cms/cms-text';
import { CMSImage } from '../../../components/cms/cms-image';

const STAFF_MEMBERS = [
    {
        id: 'belthane',
        defaultName: 'Belthane Harigan',
        defaultRole: 'Directeur régional',
        defaultImg: '/placeholders/staff_1.jpg' // You can upload real images via the CMS
    },
    {
        id: 'guy',
        defaultName: 'Guy Pierre Chavannes',
        defaultRole: 'Directeur de Zones',
        defaultImg: '/placeholders/staff_2.jpg'
    },
    {
        id: 'bev',
        defaultName: 'Bev Huff',
        defaultRole: 'Directeur Éducation',
        defaultImg: '/placeholders/staff_3.jpg'
    },
    {
        id: 'janette',
        defaultName: 'Janette Sanders',
        defaultRole: 'Directeur littérature',
        defaultImg: '/placeholders/staff_4.jpg'
    },
    {
        id: 'rodia',
        defaultName: 'Rodia G.P Chavannes',
        defaultRole: 'Assistant Directeur Éducation',
        defaultImg: '/placeholders/staff_5.jpg'
    }
];

export default function StaffPage() {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Header />
            
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 bg-zinc-50 overflow-hidden">
                     {/* Background Decorative */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    <div className="container mx-auto px-4 text-center relative z-10">
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wide mb-4">
                            <CMSText k="staff.hero.badge" defaultVal="Leadership" />
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mb-4 drop-shadow-sm">
                            <CMSText k="staff.hero.title" defaultVal="Équipe Régionale NAC" />
                        </h1>
                        <p className="text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
                            <CMSText k="staff.hero.subtitle" defaultVal="Rencontrez les leaders dévoués qui guident notre mission à travers l'Amérique du Nord, l'Amérique du Sud et les Caraïbes." />
                        </p>
                    </div>
                </section>

                {/* Staff Grid */}
                <section className="py-12 md:py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6 justify-center">
                            {STAFF_MEMBERS.map((member) => (
                                <div key={member.id} className="group flex flex-col items-center">
                                    {/* Reduced max-width from 320px to 240px and border radius */}
                                    <div className="w-full aspect-3/4 max-w-60 relative rounded-xl overflow-hidden shadow-md mb-4 bg-zinc-100 border border-zinc-200">
                                        <CMSImage 
                                            k={`staff.member.${member.id}.image`}
                                            defaultSrc="https://placehold.co/400x533/e2e8f0/94a3b8?text=Photo"
                                            alt={member.defaultName}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            width={300}
                                            height={400}
                                        />
                                        {/* Overlay gradient for premium feel */}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    
                                    <div className="text-center w-full px-4">
                                        {/* Reduced text size from 2xl to lg/xl */}
                                        <h3 className="text-lg md:text-xl font-bold text-zinc-900 mb-1 group-hover:text-[#981a3c] transition-colors">
                                            <CMSText k={`staff.member.${member.id}.name`} defaultVal={member.defaultName} />
                                        </h3>
                                        <div className="text-[#981a3c] font-medium tracking-wide uppercase text-[10px] md:text-xs mb-2">
                                            <CMSText k={`staff.member.${member.id}.role`} defaultVal={member.defaultRole} />
                                        </div>
                                        <div className="w-8 h-1 bg-zinc-200 mx-auto rounded-full group-hover:w-16 group-hover:bg-[#981a3c]/30 transition-all duration-300"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Join CTA */}
                <section className="py-16 bg-zinc-900 text-white text-center rounded-2xl mx-4 md:mx-8 mb-8 relative overflow-hidden shadow-xl">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-400 via-gray-900 to-black"></div>
                    <div className="relative z-10 container mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-4">
                            <CMSText k="staff.cta.title" defaultVal="Rejoignez Notre Mission" />
                        </h2>
                        <p className="text-zinc-400 max-w-xl mx-auto mb-8 text-base">
                            <CMSText k="staff.cta.desc" defaultVal="Vous voulez faire partie de cette équipe dynamique et impacter des vies ?" />
                        </p>
                        <a href="../implicate" className="inline-block bg-[#981a3c] hover:bg-[#7a1530] text-white font-bold py-2.5 px-6 text-sm rounded-full transition-all hover:shadow-lg hover:-translate-y-1">
                            <CMSText k="staff.cta.button" defaultVal="Impliquez-vous" />
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
