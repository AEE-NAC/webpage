"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase.conf';
import TestimonialCard from '../common/TestimonialsCard';
import { CMSText } from '../cms/cms-text';
// Note: useCMS is kept if needed for other strings, but we use lang prop for data
import { useCMS } from '../cms/cms-provider';

interface Testimonial {
  id: string;
  author_name: string;
  author_role: string;
  content: string;
  image_url: string;
}

const TestimonialsSection = ({ lang }: { lang: string }) => {
  // TRACE 1: Rendu immédiat du composant
  console.log(`[Component] TestimonialsSection: Rendering call with lang="${lang}"`);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TRACE 2: Activation du cycle de vie
    console.info(`[Lifecycle] TestimonialsSection: useEffect triggered for lang="${lang}"`);
    
    if (!lang) {
      console.error("[Lifecycle] TestimonialsSection: Aborting fetch because lang is missing.");
      return;
    }

    const fetchTestimonials = async () => {
        console.info(`[Supabase] Testimonials: Querying table "cms_testimonials" for lang="${lang}"`);
        setLoading(true);
        try {
            const { data, error: sbError } = await supabase
                .from('cms_testimonials')
                .select('*')
                .eq('language', lang)
                .order('created_at', { ascending: false })
                .limit(3);
            
            if (sbError) {
                console.error("[Supabase] Testimonials Error:", sbError.message, sbError.details);
                setError(sbError.message);
                throw sbError;
            }

            console.info(`[Supabase] Testimonials Success: Received ${data?.length || 0} items for "${lang}"`);
            if (data && data.length > 0) {
              setTestimonials(data as any);
            } else {
              console.warn(`[Supabase] Testimonials: Query returned 0 results for lang="${lang}". This is why the section is hidden.`);
            }
        } catch (e: any) {
            console.error("[Testimonials State] Fatal error during fetch chain:", e.message || e);
            setError(e.message || "Unknown error");
        } finally {
            setLoading(false);
            console.info("[Lifecycle] Testimonials: Loading process finished.");
        }
    };

    fetchTestimonials();
  }, [lang]);

  // Si erreur, on affiche au moins un log d'erreur visible
  if (error) return <div className="hidden">Testimonials error: {error}</div>;
  if (loading) return null;
  if (testimonials.length === 0) {
     // TRACE 3: Pourquoi le retour est null
     console.warn("[Component] TestimonialsSection: Not rendering UI because testimonials array is empty.");
     return null;
  }

  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-900/40 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-5 bg-[radial-gradient(circle,var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
                <span className="text-[#981a3c] font-black uppercase tracking-widest text-xs mb-3 block">Histoires d'impact</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#2a2c41] dark:text-zinc-100">
                    <CMSText k="home.testimonials.title" defaultVal="Ce qu'ils disent de nous" />
                </h2>
                <div className="w-12 h-1 bg-[#981a3c] mx-auto mt-4 rounded-full"></div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 overflow-x-auto pb-8 justify-center">
                {testimonials.map(t => (
                    <div key={t.id} className="w-full md:w-100 shrink-0">
                        <TestimonialCard 
                            name={t.author_name}
                            title={t.author_role}
                            text={t.content}
                            imgSrc={t.image_url || `https://ui-avatars.com/api/?name=${t.author_name}&background=random`}
                        />
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};

export default TestimonialsSection;
