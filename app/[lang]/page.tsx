import React, { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import About from '@/components/layout/About';
import Carousel from '@/components/layout/carousel';
import { CMSText } from '@/components/cms/cms-text';
import { VisualEditorListener } from '@/components/admin/visual-editor-listener';
import { SupportedLanguage } from '@/context/adapt';

// New Imports
import { WeeklyWordFeed, NewsletterFeed, DirectorGreeting } from '@/components/home/feeds';
import ImpactSection from '@/components/home/impact-section';
import TestimonialsSection from '@/components/home/testimonials-section';

export default async function Home({ params }: { params: Promise<{ lang: SupportedLanguage }> }) {
  // We await params to support Next.js 15+ async params
  const { lang } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black font-sans">
      <Suspense fallback={null}>
        <VisualEditorListener />
      </Suspense>

      <Header />
      
      <main className="flex-1 w-full flex flex-col">
        {/* HERO SECTION WITH CAROUSEL */}
        <div className="flex flex-col md:flex-row h-full relative w-full overflow-hidden">
          <Carousel />
          
          <div 
            className="absolute bottom-0 left-0 right-0 min-h-75 flex flex-col items-center justify-center p-8 z-10"
            style={{
              background: 'linear-gradient(to bottom, rgb(152 26 60 / 0%) 0%, rgba(152, 26, 60, 0.95) 40%)',
              backdropFilter: 'blur(1px)'
            }}
          >
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <h1 className="text-white text-2xl md:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-md">
                <CMSText k="home.hero.welcome_prefix" defaultVal="Welcome to the site of" />
                <span className="block mt-2 bg-linear-to-r from-white to-pink-100 bg-clip-text text-transparent">
                   <CMSText k="home.hero.welcome_org" defaultVal="Child Evangelism Fellowship" />
                </span>
              </h1>
              <div className="w-20 h-1 mx-auto bg-white/30 rounded-full" />
              <p className="text-white/90 text-lg md:text-2xl font-medium leading-relaxed drop-shadow-sm">
                 <CMSText k="home.hero.region_subtitle" defaultVal="North/South America & Caribbean Region (Creole & Francophone)" />
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT SECTIONS */}
        <div className="flex flex-col w-full">
          <About />
          
          {/* Director's Greeting */}
          <DirectorGreeting />
          
          {/* Ministries / Impact Section (Renamed & Moved) */}
          <ImpactSection />
          
          {/* Dynamic Feeds */}
          <WeeklyWordFeed lang={lang} />

          {/* Testimonials */}
          <TestimonialsSection />

          <NewsletterFeed lang={lang} />
          
        </div>
      </main>

      <Footer />
    </div>
  );
}