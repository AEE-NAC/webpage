"use client";

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { locales, SupportedLanguage } from '@/context/adapt';

const LanguageSwitcher = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Derive current language from URL (e.g., /en/about -> en)
  const currentLang = pathname.split('/')[1] as SupportedLanguage || 'en';

  const languages: { code: SupportedLanguage; country: string; name: string }[] = [
    { code: 'en', country: 'us', name: 'EN' },
    { code: 'fr', country: 'fr', name: 'FR' },
    { code: 'es', country: 'es', name: 'ES' },
    { code: 'ht', country: 'ht', name: 'KR' }
  ];

  const currentLanguageConfig = languages.find(l => l.code === currentLang) || languages[0];

  const switchLanguage = (newLang: string) => {
    // Replace the first segment of the path
    const segments = pathname.split('/');
    segments[1] = newLang; // /en/... -> /fr/...
    const newPath = segments.join('/');
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-[#2b2b3f] border border-[#981a3c] bg-[#fdfff4] hover:bg-zinc-100 transition-colors"
      >
        <img 
          src={`https://flagcdn.com/w20/${currentLanguageConfig.country}.png`} 
          alt={currentLanguageConfig.name}
          className="w-5 h-3.75 rounded-[2px]"
        />
        <span className="text-sm font-medium">{currentLanguageConfig.name}</span>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-999 w-full min-w-25 bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-lg">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-zinc-100 transition-colors text-left"
            >
              <img 
                src={`https://flagcdn.com/w20/${lang.country}.png`} 
                alt={lang.name}
                className="w-5 h-3.75 rounded-[2px]"
              />
              <span className="text-sm text-zinc-700">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* Backdrop to close */}
      {isOpen && <div className="fixed inset-0 z-990" onClick={() => setIsOpen(false)}></div>}
    </div>
  );
};

export default LanguageSwitcher;