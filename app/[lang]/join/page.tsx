"use client";

import React, { useState, useEffect } from 'react';
import { CMSText } from '../../../components/cms/cms-text';
import { CMSImage } from '../../../components/cms/cms-image';
import { useParams, useRouter } from 'next/navigation';
import { defaultLocale, SupportedLanguage } from '../../../context/adapt';
import { supabase, CMSService } from '../../../services/supabase.conf';
import { CMSProvider } from '../../../components/cms/cms-provider';

const Join = () => {
    const params = useParams();
    const router = useRouter();
    const lang = (params?.lang as SupportedLanguage) || defaultLocale;
    
    // FETCH DICTIONARY FOR ATTRIBUTES
    const [dictionary, setDictionary] = useState<Record<string, string>>({});
    useEffect(() => {
        CMSService.getPageContent('join', lang).then(setDictionary);
    }, [lang]);

    // Helper for attributes regex scanner: matches /cms\s*\(\s*(['"`])(.*?)\1\s*,\s*(['"`])(.*?)\3\s*\)/gs
    const cms = (k: string, v: string) => dictionary[k] || v;

    const [step, setStep] = useState(1);
    const [joinType, setJoinType] = useState('');

    // Newsletter State
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('newsletter')
                .insert([{ name, email }] as any);

            if (error) {
                setStatusMessage('error');
            } else {
                setStatusMessage('success');
                setStep(3);
            }
        } catch (error) {
            setStatusMessage('error');
        } finally {
            setLoading(false);
        }
    };

    const handleSelection = (type: string) => {
        if (type === 'record') {
            router.push(`/${lang}/record`);
            return;
        }
        setJoinType(type);
        setStep(2);
    };

    return (
      <CMSProvider dictionary={dictionary}>
        <div className="h-screen flex justify-center items-center p-4 md:p-6 bg-zinc-50 font-sans overflow-hidden">
            <div className="w-full max-w-7xl h-full md:h-[90vh] flex flex-col md:flex-row gap-8">
                
                {/* Left Side: Visual */}
                <div className="w-full md:w-1/2 bg-zinc-200 relative overflow-hidden transition-all duration-500 ease-in-out rounded-3xl shadow-xl h-full border border-zinc-200/50">
                    <div className="absolute inset-0">
                        <CMSImage
                            k="join.hero.image"
                            defaultSrc="/static/website1.avif"
                            alt="Join us illustration"
                            className="w-full h-full object-cover grayscale-10"
                            fill
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex items-end p-8">
                            <div className="animate-in slide-in-from-bottom-6 duration-700">
                                <p className="text-white text-xl font-medium italic leading-relaxed">
                                    "<CMSText k="join.hero.quote" defaultVal="Rejoignez-nous pour porter la Bonne Nouvelle à chaque enfant." />"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Multistep Form */}
                <div className="w-full h-full md:w-1/2 flex flex-col relative">
                    
                    {/* Header / Nav */}
                    <div className="flex justify-between items-center mb-6 shrink-0 pt-2">
                        <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                            <a href={`/${lang}`} className="">
                                <img src="/static/cef_logo.svg" alt="Logo" className="h-8 w-auto grayscale hover:grayscale-0 transition-all" />
                            </a>
                            <div className="h-4 w-px bg-zinc-400"></div>
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest"><CMSText k="join.header_label" defaultVal="Engagement" /></span>
                        </div>
                        {step > 1 && (
                            <button onClick={() => setStep(step - 1)} className="text-xs font-bold text-zinc-500 hover:text-[#981a3c] uppercase flex items-center gap-1 transition-colors">
                                ← <CMSText k="join.back" defaultVal="Retour" />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full relative">
                        
                        {/* Title Section */}
                        <div className={`text-center mb-8 transition-all duration-300 ${step > 1 ? 'opacity-0 h-0 overflow-hidden mb-0' : 'opacity-100'}`}>
                            <h1 className="text-4xl font-extrabold mb-3 text-[#981a3c]">
                                <CMSText k="join.title" defaultVal="Rejoignez l'Aventure" />
                            </h1>
                            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto">
                                <CMSText k="join.description" defaultVal="Choisissez l'option qui vous correspond le mieux pour rester connecté." />
                            </p>
                        </div>

                        {/* STEP 1: SELECTION */}
                        {step === 1 && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-right-8 duration-500">
                                <button
                                    onClick={() => handleSelection('newsletter')}
                                    className="w-full text-left p-4 rounded-xl border border-zinc-200 bg-white hover:border-[#981a3c]/30 hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 rounded-full bg-zinc-50 group-hover:bg-[#981a3c]/10 flex items-center justify-center text-lg text-zinc-400 group-hover:text-[#981a3c] transition-colors">
                                        📰
                                    </div>
                                    <div>
                                        <div className="font-bold text-zinc-700 group-hover:text-[#981a3c] transition-colors"><CMSText k="join.type.newsletter" defaultVal="Suivre la Newsletter" /></div>
                                        <div className="text-xs text-zinc-400 group-hover:text-zinc-500"><CMSText k="join.type_desc.newsletter" defaultVal="Restez informé de nos activités et de nos événements." /></div>
                                    </div>
                                    <div className="ml-auto text-zinc-300 group-hover:text-[#981a3c]">→</div>
                                </button>

                                <button
                                    onClick={() => handleSelection('record')}
                                    className="w-full text-left p-4 rounded-xl border border-zinc-200 bg-white hover:border-[#981a3c]/30 hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group flex items-center gap-4"
                                >
                                    <div className="w-10 h-10 rounded-full bg-zinc-50 group-hover:bg-[#981a3c]/10 flex items-center justify-center text-lg text-zinc-400 group-hover:text-[#981a3c] transition-colors">
                                        🎓
                                    </div>
                                    <div>
                                        <div className="font-bold text-zinc-700 group-hover:text-[#981a3c] transition-colors"><CMSText k="join.type.record" defaultVal="Déjà suivi une formation ?" /></div>
                                        <div className="text-xs text-zinc-400 group-hover:text-zinc-500"><CMSText k="join.type_desc.record" defaultVal="Enregistrez votre parcours et rejoignez notre réseau de moniteurs." /></div>
                                    </div>
                                    <div className="ml-auto text-zinc-300 group-hover:text-[#981a3c]">→</div>
                                </button>
                            </div>
                        )}

                        {/* STEP 2: NEWSLETTER FORM */}
                        {step === 2 && joinType === 'newsletter' && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500 bg-white/50 backdrop-blur-sm p-1 rounded-2xl">
                                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                                    <div className="mb-2">
                                        <div className="text-xs font-bold text-zinc-400 uppercase mb-1 tracking-wider"><CMSText k="join.form.category" defaultVal="Newsletter" /></div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block"><CMSText k="join.form.name" defaultVal="Nom complet" /></label>
                                        <input 
                                            type="text" 
                                            value={name} 
                                            onChange={(e) => setName(e.target.value)} 
                                            required 
                                            placeholder={cms('join.placeholder.name', 'Prénom Nom')}
                                            className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-xl p-3 focus:ring-[#981a3c] focus:border-[#981a3c] shadow-sm" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block"><CMSText k="join.form.email" defaultVal="Email" /></label>
                                        <input 
                                            type="email" 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            required 
                                            placeholder={cms('join.placeholder.email', 'exemple@mail.com')}
                                            className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-xl p-3 focus:ring-[#981a3c] focus:border-[#981a3c] shadow-sm" 
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <button type="submit" disabled={loading} className="w-full bg-[#981a3c] text-white py-3.5 rounded-xl font-bold hover:bg-[#7a1530] transition-all disabled:opacity-50">
                                            {loading ? <CMSText k="join.form.btn_sending" defaultVal="Chargement..." /> : <CMSText k="join.form.btn_submit" defaultVal="S'abonner maintenant" />}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* STEP 3: SUCCESS */}
                        {step === 3 && (
                            <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-500">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
                                <h2 className="text-2xl font-bold text-zinc-900 mb-2"><CMSText k="join.success.title" defaultVal="Confirmation" /></h2>
                                <p className="text-zinc-500 text-sm mb-8"><CMSText k="join.success.message" defaultVal="Merci ! Vous êtes maintenant inscrit à notre liste d'information." /></p>
                                <button onClick={() => router.push(`/${lang}`)} className="bg-zinc-800 text-white px-10 py-3 rounded-xl font-bold hover:bg-zinc-700 transition-all">
                                    <CMSText k="join.success.home" defaultVal="Retour à l'accueil" />
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4d4d8; }
            `}</style>
        </div>
      </CMSProvider>
    );
};

export default Join;
