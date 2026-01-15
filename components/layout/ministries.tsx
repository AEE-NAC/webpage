"use client";

import React, { useEffect, useState } from 'react';
import { CMSText } from '../cms/cms-text';
import { supabase } from '@/services/supabase.conf';
import { useCMS } from '../cms/cms-provider';

interface Club {
    id: string;
    title: string;
    description: string;
    image_url: string;
    logo_url: string;
}

const Ministries = () => {
    const { locale } = useCMS() as any;
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClubs = async () => {
            const { data, error } = await supabase
                .from('cms_clubs')
                .select('*')
                .eq('language', locale)
                .order('created_at', { ascending: true });
            
            if (data && !error) {
                setClubs(data as any);
            }
            setLoading(false);
        };

        fetchClubs();
    }, [locale]);

    return (
        <section id="ministries" className="bg-[#fdfff4ff] w-full flex justify-center py-12 md:py-24 lg:py-32">
            <div className="container">
                <div className="space-y-4 text-center">
                    <div className="inline-block rounded-full bg-[#f2e288] px-4 py-1 text-sm text-[#0f0f0fff] font-medium">
                        <CMSText k="home.ministries.badge" defaultVal="Our Ministries" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#0f0f0fff]">
                        <CMSText k="home.ministries.title" defaultVal="Transforming Lives" />
                    </h2>
                    <p className="text-[#878578ff] max-w-2xl mx-auto">
                        <CMSText k="home.ministries.desc" defaultVal="Discover how we impact the community." />
                    </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 p-6">
                    {loading ? (
                        <div className="col-span-full py-12 text-center text-zinc-400">Loading ministries...</div>
                    ) : clubs.length > 0 ? (
                        clubs.map((club) => (
                            <div key={club.id} className="text-card-foreground shadow-sm bg-[#fdfff4ff] border border-[#878578ff] rounded-2xl overflow-hidden group hover:border-[#981a3c] transition-colors">
                                <div className="p-6 space-y-4">
                                    <div className="relative">
                                        <div className="w-full h-48 bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            {club.image_url ? (
                                                <img 
                                                    src={club.image_url} 
                                                    alt={club.title} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-zinc-200">
                                                    <span className="text-zinc-400">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                        {club.logo_url && (
                                            <div className="absolute -bottom-6 right-4 w-12 h-12 bg-white rounded-full p-2 shadow-md border border-zinc-100">
                                                <img src={club.logo_url} alt="Logo" className="w-full h-full object-contain" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#0f0f0fff] pt-2">
                                        {club.title}
                                    </h3>
                                    <p className="text-[#878578ff]">
                                        {club.description}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center text-zinc-500 italic">
                            No ministries found for this region/language.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Ministries;