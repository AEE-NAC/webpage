"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase.conf';
import TestimonialCard from '../common/TestimonialsCard';
import { CMSText } from '../cms/cms-text';
import { useCMS } from '../cms/cms-provider';

interface Testimonial {
  id: string;
  author_name: string;
  author_role: string;
  content: string;
  image_url: string;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const { locale } = useCMS() as any;

  useEffect(() => {
    // Client-side fetch is acceptable here for simplicity in a "section" component
    // Alternatively pass data from server page
    const fetchTestimonials = async () => {
        // Simple logic: fetch for current language OR global (no country/lang restrictions for demo)
        // In prod, filter by locale
        const { data } = await supabase
            .from('cms_testimonials')
            .select('*')
            .eq('language', locale)
            .order('created_at', { ascending: false })
            .limit(3);
        
        if (data) setTestimonials(data as any);
    };

    fetchTestimonials();
  }, [locale]);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-amber-50/50">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#2a2c41]">
                <CMSText k="home.testimonials.title" defaultVal="What People Say" />
            </h2>
            <div className="flex flex-col md:flex-row gap-8 overflow-x-auto pb-8 justify-center">
                {testimonials.map(t => (
                    <div key={t.id} className="w-full md:w-[400px] flex-shrink-0">
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
