import React from 'react';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { CMSText } from '../../../components/cms/cms-text';
import { CMSImage } from '../../../components/cms/cms-image';
import { supabase } from '../../../services/supabase.conf';
import { SupportedLanguage } from '../../../context/adapt';
import { CMSProvider } from '../../../components/cms/cms-provider';
import { CMSService } from '../../../services/supabase.conf';

interface CMSClub {
  id: string;
  title: string;
  description: string;
  logo_url: string;
  image_url: string;
}

export default async function MinistryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = langParam as SupportedLanguage;
  
  // Fetch dictionary
  const dictionary = await CMSService.getPageContent('ministry', lang);

  // Récupération des clubs/ministères depuis la base de données
  const { data: clubs } = await supabase
    .from('cms_clubs')
    .select('*')
    .eq('language', lang)
    .order('created_at', { ascending: true });

  return (
    <CMSProvider dictionary={dictionary}>
        <div className="flex min-h-screen flex-col bg-white">
          <Header />

          <main className="flex-1">
            {/* 1. HERO & HISTOIRE SECTION */}
            <section className="relative py-24 bg-zinc-50 overflow-hidden">
              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#981a3c]/10 text-[#981a3c] text-xs font-bold uppercase tracking-widest mb-4">
                    <CMSText k="ministry.history.badge" defaultVal="Notre Héritage" />
                  </span>
                  <h1 className="text-4xl md:text-6xl font-extrabold text-zinc-900 mb-6">
                    <CMSText k="ministry.history.title" defaultVal="Porter l'Espoir à Chaque Enfant" />
                  </h1>
                  <div className="w-20 h-1.5 bg-[#981a3c] mx-auto rounded-full mb-8"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                  <div className="space-y-6 text-lg text-zinc-600 leading-relaxed">
                    <CMSText 
                      as="p" 
                      k="ministry.history.p1" 
                      defaultVal="Depuis sa fondation, l'Association pour l'Évangélisation des Enfants (AEE) s'est donné pour mission d'atteindre les enfants là où ils se trouvent. Nos ministères sont nés d'une conviction profonde : chaque enfant a le droit d'entendre la Bonne Nouvelle d'une manière qu'il peut comprendre." 
                    />
                    <CMSText 
                      as="p" 
                      k="ministry.history.p2" 
                      defaultVal="Pourquoi ces ministères existent ? Parce que l'enfance est le moment le plus critique de la vie d'un individu pour bâtir des fondations spirituelles solides. Nos clubs ne sont pas seulement des activités, ce sont des refuges de paix, d'apprentissage et de transformation." 
                    />
                  </div>
                  <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                    <CMSImage 
                      k="ministry.history.image" 
                      defaultSrc="/static/CBN_guadeloupe.jpeg" 
                      alt="History" 
                      className="w-full h-full object-cover" 
                      fill
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 2. LISTE DES CLUBS (MINISTÈRES) */}
            <section className="py-24 bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                  <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">
                    <CMSText k="ministry.list.title" defaultVal="Nos Programmes d'Impact" />
                  </h2>
                  <p className="text-zinc-500 max-w-xl mx-auto">
                    <CMSText k="ministry.list.subtitle" defaultVal="Découvrez les différentes façons dont nous engageons les enfants dans nos communautés." />
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                  {(clubs as CMSClub[] || []).map((club) => (
                    <div key={club.id} className="group flex flex-col bg-white rounded-3xl border border-zinc-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                      <div className="h-52 relative overflow-hidden">
                        <img 
                          src={club.image_url || 'https://placehold.co/600x400/981a3c/ffffff?text=Ministry'} 
                          alt={club.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        {club.logo_url && (
                          <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-2xl shadow-lg p-2.5 flex items-center justify-center">
                            <img src={club.logo_url} alt="Logo" className="w-full h-full object-contain" />
                          </div>
                        )}
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold text-zinc-900 mb-3 group-hover:text-[#981a3c] transition-colors">{club.title}</h3>
                        <p className="text-zinc-600 leading-relaxed mb-8 flex-1">
                          {club.description}
                        </p>
                        <a href={`/${lang}/implicate`} className="text-[#981a3c] font-bold flex items-center gap-2 hover:gap-4 transition-all uppercase text-xs tracking-widest">
                          <CMSText k="ministry.club.join_label" defaultVal="S'impliquer" /> →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 3. CALL TO ACTION (CTA) */}
            <section className="py-20 px-4">
              <div className="container mx-auto max-w-5xl">
                <div className="relative bg-zinc-900 text-white rounded-3xl p-8 md:p-16 text-center overflow-hidden shadow-2xl">
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
          </main>

          <Footer />
        </div>
    </CMSProvider>
  );
}
