import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [currentLang, setCurrentLang] = useState('en');
    const [translationsCache, setTranslationsCache] = useState({});

    // Modified to use useCallback and avoid state updates during render
    const loadComponentTranslations = useCallback(async (component) => {
        // First check cache
        if (translationsCache[component]) {
            return translationsCache[component];
        }

        try {
            const response = await fetch(`/lang/translations/${component}.json`);
            const data = await response.json();
            
            // Update cache in useEffect to avoid render-time updates
            setTranslationsCache(prevCache => ({
                ...prevCache,
                [component]: data,
            }));
            
            return data;
        } catch (error) {
            console.error(`Failed to load translations for ${component}:`, error);
            return {};
        }
    }, [translationsCache]);

    const updateDOMTranslations = useCallback(async () => {
        const elements = document.querySelectorAll('[i18-id]');
        const componentsToLoad = new Set();

        elements.forEach((element) => {
            const i18Id = element.getAttribute('i18-id');
            const component = i18Id.split('-')[0];
            componentsToLoad.add(component);
        });

        const loadedTranslations = {};
        await Promise.all(
            Array.from(componentsToLoad).map(async (component) => {
                const data = await loadComponentTranslations(component);
                loadedTranslations[component] = data;
            })
        );

        elements.forEach((element) => {
            const i18Id = element.getAttribute('i18-id');
            const component = i18Id.split('-')[0];
            const translationKey = i18Id;
            const translation = loadedTranslations[component]?.[translationKey]?.[currentLang];

            if (translation) {
                element.textContent = translation;
            }
        });
    }, [currentLang, loadComponentTranslations]);

    useEffect(() => {
        const fetchLanguagePreference = async () => {
            try {
                const response = await fetch('/api/user/language-preference');
                const data = await response.json();
                setCurrentLang(data.language || 'en');
            } catch (error) {
                console.error('Failed to fetch language preference:', error);
            }
        };

        fetchLanguagePreference();
        updateDOMTranslations();
    }, [updateDOMTranslations]);

    const translate = useCallback(async (key) => {
        const component = key.split('-')[0];
        const componentTranslations = await loadComponentTranslations(component);
        return componentTranslations[key]?.[currentLang] || key;
    }, [currentLang, loadComponentTranslations]);

    return (
        <LanguageContext.Provider value={{ 
            currentLang, 
            setLang: setCurrentLang,
            translate,
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};