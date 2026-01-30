"use client";

import React, { createContext, useContext, useEffect } from 'react';

type CMSContextType = {
    dictionary: Record<string, string>;
    locale: string;
    loading: boolean;
};

const CMSContext = createContext<CMSContextType>({
    dictionary: {},
    locale: 'en',
    loading: true,
});

export const useCMS = () => useContext(CMSContext);

export const CMSProvider = ({ 
    children, 
    dictionary = {}, 
    locale = 'en' 
}: { 
    children: React.ReactNode, 
    dictionary?: Record<string, string>, 
    locale?: string 
}) => {
    
    useEffect(() => {
        const keyCount = Object.keys(dictionary).length;
        if (keyCount > 0) {
            console.info(`%c[CMS Provider] Initialized for locale "${locale}"`, "color: #981a3c; font-weight: bold; font-size: 12px;");
            console.info(`%c[CMS Provider] Loaded ${keyCount} translation keys from Supabase.`, "color: #981a3c;");
        } else {
            console.warn(`%c[CMS Provider] initialized EMPTY for locale "${locale}". Check Supabase connection or if build step fetched data.`, "background: yellow; color: black; font-size: 12px;");
        }
    }, [dictionary, locale]);

    return (
        <CMSContext.Provider value={{ dictionary, locale, loading: false }}>
            {children}
        </CMSContext.Provider>
    );
};
