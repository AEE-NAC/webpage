"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CMSService } from '@/services/supabase.conf';
import { CMSPopover } from '@/services/types';
import { CookieService } from '@/services/cookies';
import { useCMS } from './cms-provider';

// Helper to check if path matches targets
const isPageMatch = (targetPages: string[], currentPath: string) => {
    if (!targetPages || targetPages.length === 0) return false;
    if (targetPages.includes('*')) return true;
    
    // Normalize path: /en/about -> /about
    // Assuming structure /[lang]/...
    const pathParts = currentPath.split('/').filter(Boolean);
    const pathWithoutLang = pathParts.length > 1 && ['en','fr','es','ht'].includes(pathParts[0]) 
        ? '/' + pathParts.slice(1).join('/')
        : currentPath;
        
    return targetPages.some(page => {
        if (page === pathWithoutLang) return true;
        if (page !== '/' && pathWithoutLang.startsWith(page)) return true;
        return false;
    });
};

export const CMSPopupManager = () => {
    const pathname = usePathname();
    const { dictionary } = useCMS(); // Just used to trigger updates if context changes
    
    const [popovers, setPopovers] = useState<CMSPopover[]>([]);
    const [visibleBanner, setVisibleBanner] = useState<CMSPopover | null>(null);
    const [visibleModal, setVisibleModal] = useState<CMSPopover | null>(null);

    // 1. Fetch Active Popovers on Mount
    useEffect(() => {
        const lang = pathname.split('/')[1] || 'en';
        CMSService.getActivePopovers(lang).then(data => setPopovers(data));
    }, [pathname]);

    // 2. Logic to filter and display
    useEffect(() => {
        if (!popovers.length) return;

        // Find match for current page
        const relevant = popovers.filter(p => isPageMatch(p.target_pages || [], pathname));
        
        // Handle Banners
        const matchedBanner = relevant.find(p => p.component_type === 'banner');
        if (matchedBanner && !CookieService.get(`cms_closed_${matchedBanner.id}`)) {
            setVisibleBanner(matchedBanner);
        } else {
            setVisibleBanner(null);
        }

        // Handle Modals
        const matchedModal = relevant.find(p => p.component_type === 'modal');
        if (matchedModal && !CookieService.get(`cms_closed_${matchedModal.id}`)) {
            // Delay modal slightly for better UX
            const timer = setTimeout(() => setVisibleModal(matchedModal), 1000);
            return () => clearTimeout(timer);
        } else {
            setVisibleModal(null);
        }

    }, [popovers, pathname]);

    const handleClose = (item: CMSPopover) => {
        if (item.component_type === 'banner') setVisibleBanner(null);
        if (item.component_type === 'modal') setVisibleModal(null);
        
        // Save dismissal cookie
        if (item.frequency_hours > 0) {
            CookieService.set(`cms_closed_${item.id}`, 'true', item.frequency_hours / 24); // days
        }
    };

    return (
        <>
            {/* Banner UI */}
            {visibleBanner && (
                <div className="fixed top-0 left-0 w-full z-50 bg-blue-600 text-white px-4 py-3 shadow-md transition-transform animate-in slide-in-from-top duration-300">
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                        <div className="flex-1 flex items-center gap-3">
                            <span className="font-bold">{visibleBanner.title}</span>
                            <span className="h-4 w-px bg-white/30 hidden sm:block"></span>
                            <div className="text-sm opacity-90" dangerouslySetInnerHTML={{ __html: visibleBanner.body || '' }} />
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                             {visibleBanner.cta_url && (
                                 <a href={visibleBanner.cta_url} className="px-3 py-1 bg-white text-blue-600 text-xs font-bold rounded-full hover:bg-zinc-100">
                                     {visibleBanner.cta_text || "Learn More"}
                                 </a>
                             )}
                             <button onClick={() => handleClose(visibleBanner)} className="p-1 hover:bg-white/20 rounded-full">
                                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                             </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal UI */}
            {visibleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                     <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden relative animate-in zoom-in-95 duration-200">
                        {visibleModal.image_url && (
                            <div className="h-40 w-full bg-zinc-100 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={visibleModal.image_url} alt="" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <button onClick={() => handleClose(visibleModal)} className="absolute top-3 right-3 p-1.5 bg-black/10 hover:bg-black/20 rounded-full text-zinc-500 hover:text-white transition-colors backdrop-blur-md">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{visibleModal.title}</h3>
                            <div className="prose prose-sm text-zinc-600 dark:text-zinc-300 mb-6" dangerouslySetInnerHTML={{ __html: visibleModal.body || '' }} />
                            
                            {visibleModal.cta_url && (
                                <a 
                                    href={visibleModal.cta_url} 
                                    className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold rounded-lg transition-colors"
                                >
                                    {visibleModal.cta_text || "Continue"}
                                </a>
                            )}
                        </div>
                     </div>
                </div>
            )}
        </>
    );
};
