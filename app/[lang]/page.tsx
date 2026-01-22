import React, { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import About from '@/components/layout/About';
import Carousel from '@/components/layout/carousel';
import { CMSText } from '@/components/cms/cms-text';
import { SupportedLanguage } from '@/context/adapt';

// Ensure these imports are present
import { WeeklyWordFeed, NewsletterFeed, DirectorGreeting } from '@/components/home/feeds';
import ImpactSection from '@/components/home/impact-section';
import TestimonialsSection from '@/components/home/testimonials-section';
import { CMSService } from "@/services/supabase.conf";
import { CMSWeeklyWord, CMSNewsletter } from '@/services/types';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = langParam as SupportedLanguage;
  
  console.info(`[Server] Rendering Home Page for lang: ${lang}`);

  // Pre-fetch feeds data
  let initialWords: CMSWeeklyWord[] = [];
  let initialNewsletters: CMSNewsletter[] = [];

  try {
    console.info(`[Server] Fetching initial feeds data...`);
    [initialWords, initialNewsletters] = await Promise.all([
      CMSService.getWeeklyWords(lang),
      CMSService.getNewsletters(lang)
    ]);
    console.info(`[Server] Successfully fetched ${initialWords.length} words and ${initialNewsletters.length} newsletters.`);
  } catch (error) {
    console.error(`[Server] Error loading home page feeds:`, error);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black font-sans">
      <Header />
      
      <main className="flex-1 w-full flex flex-col">
        {/* 1. HERO SECTION */}
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

        {/* CONTENT SECTIONS REORDERED FOR LOGICAL FLOW */}
        <div className="flex flex-col w-full">
          
          {/* 2. IMPACT & MINISTRIES (What we do & Where) */}
          <ImpactSection />
          
          {/* 3. ABOUT (Who we are) */}
          <About />
          
          {/* 4. DIRECTOR GREETING (Leadership invitation) */}
          <DirectorGreeting />
          
          {/* 5. TESTIMONIALS (Social Proof) */}
          <TestimonialsSection lang={lang} />

          {/* 6. SPIRITUAL CONTENT (Weekly Word) */}
          <WeeklyWordFeed lang={lang} initialWords={initialWords} />

          {/* 7. RESOURCES (Newsletters) */}
          <NewsletterFeed lang={lang} initialNewsletters={initialNewsletters} />
          
          {/* 8. CALL TO ACTION (Final Step) */}
          <section className="py-20 px-4">
            <div className="container mx-auto max-w-5xl">
              <div className="relative bg-zinc-900 text-white rounded-3xl p-8 md:p-16 text-center overflow-hidden shadow-2xl">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#981a3c]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10 space-y-6">
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                    <CMSText k="home.cta_join.title" defaultVal="Prêt à faire une différence ?" />
                  </h2>
                  <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    <CMSText k="home.cta_join.desc" defaultVal="Rejoignez notre mission et aidez-nous à transformer la vie des enfants dans chaque nation, chaque jour." />
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                      href={`/${lang}/implicate`} 
                      className="inline-block bg-[#981a3c] hover:bg-[#7a1530] text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-105 shadow-lg"
                    >
                      <CMSText k="home.cta_join.btn_primary" defaultVal="Devenir Volontaire" />
                    </a>
                    <a 
                      href={`/${lang}/donation`} 
                      className="inline-block bg-white text-zinc-900 hover:bg-zinc-100 font-bold py-4 px-8 rounded-full transition-all hover:scale-105 shadow-md"
                    >
                      <CMSText k="home.cta_join.btn_secondary" defaultVal="Faire un Don" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}