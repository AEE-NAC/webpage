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
    
    // Normalize path logic correctly
    // /en -> /
    // /en/about -> /about
    // /about -> /about
    
    const parts = currentPath.split('/').filter(Boolean);
    const locales = ['en','fr','es','ht'];
    
    let pathToCheck = currentPath;
    
    // Check if first part is a locale
    if (parts.length > 0 && locales.includes(parts[0])) {
        if (parts.length === 1) {
            // Case: /en
            pathToCheck = '/'; 
        } else {
            // Case: /en/about
            pathToCheck = '/' + parts.slice(1).join('/');
        }
    } else {
        // Case: /about or /
        pathToCheck = currentPath === '' ? '/' : currentPath;
    }
        
    return targetPages.some(page => {
        // key === '/' means Home
        if (page === pathToCheck) return true;
        // Allow sub-path matching e.g. /blog matches /blog/post-1
        if (page !== '/' && pathToCheck.startsWith(page)) return true;
        return false;
    });
};

export const CMSPopupManager = () => {
    const pathname = usePathname();
    const { dictionary } = useCMS(); 
    
    const [popovers, setPopovers] = useState<CMSPopover[]>([]);
    const [visibleBanner, setVisibleBanner] = useState<CMSPopover | null>(null);
    const [visibleModal, setVisibleModal] = useState<CMSPopover | null>(null);

    // 1. Fetch Active Popovers
    useEffect(() => {
        const lang = pathname.split('/')[1] || 'en';
        CMSService.getActivePopovers(lang)
            .then(data => {
                setPopovers(data);
            })
            .catch(err => console.error("CMS Popup Error:", err));
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
            // Delay modal slightly for better UX so it appears after page load
            const timer = setTimeout(() => setVisibleModal(matchedModal), 1500);
            return () => clearTimeout(timer);
        } else {
            setVisibleModal(null);
        }

    }, [popovers, pathname]);

    const handleClose = (item: CMSPopover) => {
        if (item.component_type === 'banner') setVisibleBanner(null);
        if (item.component_type === 'modal') setVisibleModal(null);
        
        // Save dismissal cookie
        // frequency_hours: 24 = 1 day without showing
        if (item.frequency_hours > 0) {
            const days = item.frequency_hours / 24;
            CookieService.set(`cms_closed_${item.id}`, 'true', days); 
        }
    };

    return (
        <>
            {/* Banner UI - Relative (Pushes content down) */}
            {visibleBanner && (
                <div className="relative z-[50] w-full bg-indigo-600 text-white px-4 py-2 text-xs sm:text-sm shadow-sm transition-all animate-in slide-in-from-top duration-300 font-sans">
                    <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 relative pr-8">
                        {/* Title & Body */}
                        <div className="flex items-center gap-2 text-center md:text-left flex-wrap justify-center">
                            {visibleBanner.title && <span className="font-bold uppercase tracking-wider text-[10px] sm:text-xs bg-black/20 px-1.5 py-0.5 rounded">{visibleBanner.title}</span>}
                            <div className="opacity-95" dangerouslySetInnerHTML={{ __html: visibleBanner.body || '' }} />
                            
                            {/* CTA Button Inline */}
                            {visibleBanner.cta_url && (
                                <a href={visibleBanner.cta_url} className="ml-2 underline font-bold hover:text-indigo-100 whitespace-nowrap">
                                    {visibleBanner.cta_text || "Learn More"}
                                </a>
                            )}
                        </div>

                        {/* Close Button */}
                        <button 
                            onClick={() => handleClose(visibleBanner)} 
                            className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                            aria-label="Close"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Popover UI - Bottom Right Toast Style */}
            {visibleModal && (
                <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[100] flex flex-col items-end gap-2 animate-in slide-in-from-bottom-10 fade-in duration-500 font-sans">
                     <div className="w-full max-w-[320px] sm:max-w-sm bg-white dark:bg-zinc-900 rounded-lg shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative rings-1 ring-black/5">
                        
                        {/* Close Button - More visible */}
                        <button 
                            onClick={() => handleClose(visibleModal)} 
                            className="absolute top-2 right-2 z-20 p-1 bg-white/80 hover:bg-white dark:bg-black/50 dark:hover:bg-black rounded-full text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-all shadow-sm backdrop-blur-sm"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        {/* Image Header */}
                        {visibleModal.image_url && (
                            <div className="h-32 w-full bg-zinc-100 relative group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={visibleModal.image_url} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                            </div>
                        )}
                        
                        <div className="p-5 relative">
                            {/* Title with slight overlap if image exists */}
                            <h3 className={`text-lg font-bold text-zinc-900 dark:text-white mb-2 leading-tight pr-6 ${visibleModal.image_url ? '-mt-8 text-white relative z-10 drop-shadow-md' : ''}`}>
                                {visibleModal.title}
                            </h3>
                            
                            <div className="prose prose-sm text-zinc-600 dark:text-zinc-400 mb-4 text-sm leading-snug" dangerouslySetInnerHTML={{ __html: visibleModal.body || '' }} />
                            
                            {visibleModal.cta_url && (
                                <a 
                                    href={visibleModal.cta_url} 
                                    className="block w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-black text-center text-sm font-bold rounded-md transition-colors"
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
