"use client";

import React, { useState } from 'react';
import { supabase } from '../../../services/supabase.conf';
import { CMSText } from '../../../components/cms/cms-text';
import { CMSImage } from '../../../components/cms/cms-image';
import { useParams, useRouter } from 'next/navigation';
import { defaultLocale, SupportedLanguage } from '../../../context/adapt';

const Contact = () => {
  const params = useParams();
  const router = useRouter();
  const lang = (params?.lang as SupportedLanguage) || defaultLocale;

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    
    console.info("[Form] Contact: Tentative d'envoi du message...", { name, email });
    setLoading(true);
    try {
      const { error } = await supabase
        .from('contacts')
        .insert([{ name, email, message }] as any);

      if (error) {
        console.error("[Form] Contact: Erreur d'insertion Supabase:", error.message);
        alert('Désolé, une erreur est survenue. Veuillez réessayer.');
      } else {
        console.info("[Form] Contact: Message envoyé avec succès.");
        setStep(3);
        setIsSuccess(true);
      }
    } catch (error: any) {
      console.error("[Form] Contact: Erreur inattendue:", error);
      alert('Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center p-4 md:p-6 bg-zinc-50 font-sans overflow-hidden">
      <div className="w-full max-w-7xl h-full md:h-[90vh] flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Visual */}
        <div className="w-full md:w-1/2 bg-zinc-200 relative overflow-hidden transition-all duration-500 ease-in-out rounded-3xl shadow-xl h-full border border-zinc-200/50">
          <div className="absolute inset-0">
            <CMSImage 
              k="contact.hero.image"
              defaultSrc="/CP_pichon.jpeg"
              alt="Contact illustration" 
              className="w-full h-full object-cover grayscale-[10%]"
              fill
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-8">
              <div className="animate-in slide-in-from-bottom-6 duration-700">
                <p className="text-white text-xl font-medium italic leading-relaxed">
                    "<CMSText k="contact.hero.quote" defaultVal="Nous sommes à votre écoute pour toute question concernant notre mission." />"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full h-full md:w-1/2 flex flex-col relative">
          
          {/* Header / Nav */}
          <div className="flex justify-between items-center mb-6 shrink-0 pt-2">
            <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
              <a href={`/${lang}`} className="">
                <img src="/static/cef_logo.svg" alt="Logo" className="h-8 w-auto grayscale hover:grayscale-0 transition-all" />
              </a>
              <div className="h-4 w-px bg-zinc-400"></div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                <CMSText k="contact.header_label" defaultVal="Support" />
              </span>
            </div>
            {step === 2 && (
              <button onClick={() => setStep(1)} className="text-xs font-bold text-zinc-500 hover:text-[#981a3c] uppercase flex items-center gap-1 transition-colors">
                ← <CMSText k="contact.back" defaultVal="Retour" />
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full relative">
            {step < 3 ? (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-extrabold text-zinc-900 mb-3 text-[#981a3c]">
                    <CMSText k="contact.form.title" defaultVal="Contactez-nous" />
                  </h1>
                  <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto">
                    {step === 1 ? (
                      <CMSText k="contact.form.subtitle.step1" defaultVal="Commençons par faire connaissance." />
                    ) : (
                      <CMSText k="contact.form.subtitle.step2" defaultVal="Comment pouvons-nous vous aider aujourd'hui ?" />
                    )}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 1 ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block"><CMSText k="contact.form.name_label" defaultVal="Nom complet" /></label>
                        <input
                          type="text"
                          className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-xl p-3 focus:ring-[#981a3c] focus:border-[#981a3c] shadow-sm transition-all"
                          placeholder="Votre nom"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block"><CMSText k="contact.form.email_label" defaultVal="Email" /></label>
                        <input
                          type="email"
                          className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-xl p-3 focus:ring-[#981a3c] focus:border-[#981a3c] shadow-sm transition-all"
                          placeholder="votre@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase mb-2 block"><CMSText k="contact.form.message_label" defaultVal="Message" /></label>
                        <textarea
                          className="w-full bg-white border border-zinc-200 text-zinc-900 text-sm rounded-xl p-3 focus:ring-[#981a3c] focus:border-[#981a3c] shadow-sm transition-all resize-none"
                          placeholder="Décrivez votre demande..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={6}
                          required
                          autoFocus
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      className="w-full bg-[#981a3c] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-red-900/10 hover:shadow-red-900/20 hover:bg-[#7a1530] transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                      disabled={loading}
                    >
                      {step === 1 ? (
                        <CMSText k="contact.form.btn_next" defaultVal="Continuer" />
                      ) : (
                        loading ? <CMSText k="contact.form.btn_sending" defaultVal="Envoi en cours..." /> : <CMSText k="contact.form.btn_send" defaultVal="Envoyer le message" />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-2">
                  <CMSText k="contact.success.title" defaultVal="Message Envoyé" />
                </h2>
                <p className="text-zinc-500 text-sm mb-8">
                  <CMSText k="contact.success.message" defaultVal="Merci pour votre message. Nous vous répondrons dans les plus brefs délais." />
                </p>
                <button onClick={() => router.push(`/${lang}`)} className="bg-zinc-800 text-white px-10 py-3 rounded-xl font-bold hover:bg-zinc-700 transition-all">
                  <CMSText k="contact.success.home" defaultVal="Retour à l'accueil" />
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
  );
};

export default Contact;