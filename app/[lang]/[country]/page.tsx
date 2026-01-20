import React, { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CMSText } from '@/components/cms/cms-text';
import { CMSImage } from '@/components/cms/cms-image';
import { CMSService, supabase } from '@/services/supabase.conf';
import { SupportedLanguage } from '@/context/adapt';
import { VisualEditorListener } from '@/components/admin/visual-editor-listener';
import { CMSProvider } from '@/components/cms/cms-provider';

// Helper to get flag-based gradient colors
const getFlagGradient = (code: string) => {
    const colors: Record<string, string> = {
        HT: "from-[#00209F] to-[#D21034]", // Haïti: Bleu et Rouge
        GP: "from-[#fcd116] via-[#000000] to-[#ce1126]", // Guadeloupe vibes
        MQ: "from-[#ce1126] via-[#000000] to-[#009b3a]", // Martinique
        SX: "from-[#ed2939] to-[#00247d]", // Saint Martin
        GF: "from-[#fcd116] to-[#009b3a]", // Guyane
    };
    return colors[code] || "from-zinc-400 to-zinc-600";
};

export default async function CountryHome({ params }: { params: Promise<{ lang: SupportedLanguage, country: string }> }) {
  const { lang, country } = await params;
  const countryCode = country.toUpperCase();
  const dictionary = await CMSService.getPageContent('', lang, countryCode);
  const flagGradient = getFlagGradient(countryCode);

  return (
    <CMSProvider dictionary={dictionary}>
        <div className="bg-[#f7f7f2] min-h-screen font-sans text-zinc-900 relative overflow-x-hidden">
            <Suspense fallback={null}><VisualEditorListener /></Suspense>
            <Header />
            
            <main className="relative z-10">
                {/* 1. HERO - FOND PAPER.JPG (NO REPEAT) */}
                <section 
                    className="relative pt-40 pb-20 border-b border-zinc-200 bg-no-repeat bg-center shadow-[inset_0_-10px_20px_rgba(0,0,0,0.02)]"
                    style={{ backgroundImage: "url('/paper.jpg')", backgroundSize: 'cover' }}
                >
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min md:auto-rows-[220px]">
                            
                            {/* ORGANIZATIONAL CARD - Keep as is (text & flag gradient) */}
                            <div className={`md:col-span-5 md:row-span-2 relative rounded-[2rem] p-1 bg-linear-to-br ${flagGradient} shadow-xl flex flex-col justify-between overflow-hidden group`}>
                                <div className="absolute inset-0 bg-white m-[2px] rounded-[calc(2rem-2px)] z-0">
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/gplay.png')]"></div>
                                </div>
                                
                                <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${flagGradient} p-0.5 shadow-sm`}>
                                                <div className="w-full h-full bg-white rounded-[7px] flex items-center justify-center font-black text-[10px] tracking-tighter text-[#981a3c]">AEE</div>
                                            </div>
                                            <div className="h-px w-8 bg-zinc-200"></div>
                                            <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                                                <CMSText k="country.hero.community_label" defaultVal="Une Mission d'Amour" />
                                            </span>
                                        </div>
                                        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 leading-tight">
                                            <CMSText k="country.hero.org_full_name" defaultVal="Association pour l'Évangélisation des Enfants" />
                                        </h1>
                                    </div>

                                    <div className="mt-8 space-y-4">
                                        <div className="h-px w-full bg-zinc-100"></div>
                                        <div className="flex items-center gap-3 text-[#981a3c]">
                                            <svg className="w-5 h-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                            <span className="text-xs font-black uppercase tracking-widest">Au service des familles</span>
                                        </div>
                                        <p className="text-zinc-600 font-medium text-sm md:text-base leading-relaxed">
                                            <CMSText k="country.hero.mission_statement" defaultVal="Nous croyons que chaque enfant mérite de connaître l'espérance. Ensemble, bâtissons un environnement où ils peuvent grandir et s'épanouir spirituellement." />
                                        </p>
                                        <div className="flex items-center gap-4 pt-2">
                                            <img src={`https://flagcdn.com/w40/${country.toLowerCase()}.png`} alt="Flag" className="h-4 w-auto rounded-sm shadow-sm" />
                                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">Impact Local • {countryCode}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PHOTO 1 - Large Vertical */}
                            <div className="md:col-span-4 md:row-span-2 relative rounded-[2.5rem] overflow-hidden shadow-lg border-8 border-white group transition-all hover:shadow-2xl">
                                <CMSImage k="country.hero.img1" defaultSrc="https://placehold.co/800x1200" alt="Action" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" fill />
                            </div>

                            {/* STAT CARD */}
                            <div className="md:col-span-3 md:row-span-1 bg-[#f7f7f2]/90 backdrop-blur-sm rounded-[2.5rem] p-8 border border-white shadow-sm flex flex-col justify-center items-center text-center group">
                                <CMSText k="country.stats.children" defaultVal="12.5k+" as="div" className={`text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r ${flagGradient} mb-1`} />
                                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400">Vies Transformées</span>
                            </div>

                            {/* PHOTO 2 - Horizontal Card */}
                            <div className="md:col-span-3 md:row-span-1 relative rounded-[2.5rem] overflow-hidden shadow-lg border-8 border-white group">
                                <CMSImage k="country.hero.img2" defaultSrc="https://placehold.co/600x400" alt="Formation" className="w-full h-full object-cover transition-transform duration-700" fill />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. L'HISTOIRE - ALTERNANCE : COULEUR IVOIRE */}
                <section className="py-24 bg-[#f7f7f2] border-b border-zinc-200">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="flex flex-col md:flex-row gap-16 items-center">
                            <div className="w-full md:w-1/2">
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-[#981a3c]/10 rounded-full blur-2xl"></div>
                                    <CMSImage 
                                        k="country.history.image" 
                                        defaultSrc="https://placehold.co/600x400" 
                                        alt="History" 
                                        className="relative rounded-2xl shadow-xl border border-zinc-100 rotate-2 hover:rotate-0 transition-transform duration-300 w-full" 
                                        width={600} 
                                        height={400} 
                                    />
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 space-y-6">
                                <h2 className="text-3xl font-bold text-zinc-900 border-l-4 border-[#981a3c] pl-4">
                                    <CMSText k="country.history.title" defaultVal={`L'AEE en ${countryCode}`} />
                                </h2>
                                <div className="prose text-zinc-600 leading-relaxed font-medium">
                                    <CMSText as="div" k="country.history.content" defaultVal="Depuis notre arrivée dans ce pays, nous avons vu la main de Dieu agir puissamment. Découvrez les débuts de notre œuvre et comment elle a grandi pour toucher des milliers d'enfants." />
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div className="bg-white/60 p-4 rounded-2xl text-center shadow-sm border border-white">
                                        <div className="text-2xl font-bold text-[#981a3c]"><CMSText k="country.stats.founded" defaultVal="1995" /></div>
                                        <div className="text-xs text-zinc-500 uppercase font-bold tracking-tighter">Fondation</div>
                                    </div>
                                    <div className="bg-white/60 p-4 rounded-2xl text-center shadow-sm border border-white">
                                        <div className="text-2xl font-bold text-[#981a3c]"><CMSText k="country.stats.churches" defaultVal="120+" /></div>
                                        <div className="text-xs text-zinc-500 uppercase font-bold tracking-tighter">Partenaires</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. COLLABORATORS - ALTERNANCE : FOND PAPER.JPG (NO REPEAT) */}
                <section 
                    className="py-24 bg-no-repeat bg-center"
                    style={{ backgroundImage: "url('/paper.jpg')", backgroundSize: 'cover' }}
                >
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-zinc-900 mb-4"><CMSText k="country.partners.title" defaultVal="Nos Piliers Locaux" /></h2>
                            <p className="text-zinc-500 max-w-xl mx-auto"><CMSText k="country.partners.subtitle" defaultVal="Une œuvre rendue possible grâce à la collaboration." /></p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Card 1: Eglises */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-6">⛪</div>
                                <h3 className="text-xl font-bold mb-3 text-zinc-800"><CMSText k="country.partners.churches" defaultVal="Églises" /></h3>
                                <p className="text-zinc-600 text-sm mb-4"><CMSText k="country.partners.churches_desc" defaultVal="Partenaires essentiels pour le discipulat et l'accueil des clubs." /></p>
                            </div>

                             {/* Card 2: Ecoles */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center text-3xl mb-6">🎓</div>
                                <h3 className="text-xl font-bold mb-3 text-zinc-800"><CMSText k="country.partners.schools" defaultVal="Écoles" /></h3>
                                <p className="text-zinc-600 text-sm mb-4"><CMSText k="country.partners.schools_desc" defaultVal="Portes ouvertes pour l'enseignement biblique périscolaire." /></p>
                            </div>

                             {/* Card 3: Organisations */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-3xl mb-6">🤝</div>
                                <h3 className="text-xl font-bold mb-3 text-zinc-800"><CMSText k="country.partners.orgs" defaultVal="Organisations" /></h3>
                                <p className="text-zinc-600 text-sm mb-4"><CMSText k="country.partners.orgs_desc" defaultVal="Alliance stratégique pour l'impact social et spirituel." /></p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. MINISTRIES - ALTERNANCE : COULEUR IVOIRE */}
                <section className="py-24 bg-[#f7f7f2]">
                    <div className="container mx-auto px-4 max-w-5xl">
                         <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-zinc-100 pb-4">
                            <div>
                                <h2 className="text-3xl font-bold text-zinc-900"><CMSText k="country.ministries.title" defaultVal="Ministères Actifs" /></h2>
                                <p className="text-zinc-500 mt-1"><CMSText k="country.ministries.subtitle" defaultVal={`Ce que nous faisons concrètement en ${countryCode}`} /></p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Static placeholders enriched by CMS text - Ideally dynamic from Supabase filtered by Country */}
                            {['cbn', 'c5j', 'formation'].map((m) => (
                                <div key={m} className="group relative overflow-hidden rounded-xl bg-zinc-100 aspect-video">
                                    <CMSImage k={`country.ministry.${m}.image`} defaultSrc="/static/CP_pichon.jpeg" alt={m} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" fill />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                        <h3 className="text-white font-bold text-lg"><CMSText k={`country.ministry.${m}.name`} defaultVal={m.toUpperCase()} /></h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. CTA IMPLICATION */}
                <section className="py-24 bg-[#981a3c] text-white overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6"><CMSText k="country.cta.title" defaultVal={`Rejoignez l'équipe en ${countryCode}`} /></h2>
                        <p className="text-xl text-pink-100 max-w-2xl mx-auto mb-10"><CMSText k="country.cta.desc" defaultVal="Il y a une place pour vous. Que vous soyez enseignant, priant ou donateur, votre impact commence ici." /></p>
                        <a 
                            href={`/${lang}/implicate`} 
                            className="inline-block bg-white text-[#981a3c] font-bold py-4 px-10 rounded-full shadow-xl hover:scale-105 transition-transform"
                        >
                            <CMSText k="country.cta.btn" defaultVal="Je m'implique !" />
                        </a>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    </CMSProvider>
  );
}
