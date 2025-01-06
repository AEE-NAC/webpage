import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const defaultLang = 'fr';
    const [currentLang, setCurrentLang] = useState(() => {
        return Cookies.get('language') || defaultLang;
    });
    const [translationsCache, setTranslationsCache] = useState({});

    // Load translations from localStorage
    const loadTranslationsFromLocalStorage = useCallback((component) => {
        const cachedData = localStorage.getItem(`translations_${component}`);
        return cachedData ? JSON.parse(cachedData) : null;
    }, []);

    // Save translations to localStorage
    const saveTranslationsToLocalStorage = useCallback((component, data) => {
        localStorage.setItem(`translations_${component}`, JSON.stringify(data));
    }, []);

    // Register service worker to update cache
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js').then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            }).catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
        }
    }, []);

    const loadComponentTranslations = useCallback(async (component) => {
        // Check cache in state
        if (translationsCache[component]) {
            return translationsCache[component];
        }

        // Check localStorage cache
        const localData = loadTranslationsFromLocalStorage(component);
        if (localData) {
            setTranslationsCache((prevCache) => ({
                ...prevCache,
                [component]: localData,
            }));
            return localData;
        }

        try {
            // Fetch from server if not in localStorage
            const response = await fetch(`/lang/translations/${component}.json`);
            const data = await response.json();

            // Save to cache and localStorage
            setTranslationsCache((prevCache) => ({
                ...prevCache,
                [component]: data,
            }));
            saveTranslationsToLocalStorage(component, data);

            return data;
        } catch (error) {
            console.error(`Failed to load translations for ${component}:`, error);
            return {};
        }
    }, [translationsCache, loadTranslationsFromLocalStorage, saveTranslationsToLocalStorage]);

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

    // Monitor mutations for dynamic translation
    useEffect(() => {
        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        console.log('Node added:', node);
                        if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('i18-id')) {
                            console.log('Translating:', node);
                            const i18Id = node.getAttribute('i18-id');
                            const component = i18Id.split('-')[0];

                            loadComponentTranslations(component).then((data) => {
                                const translation = data[i18Id]?.[currentLang];
                                if (translation) {
                                    node.textContent = translation;
                                }
                            });
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
        };
    }, [currentLang, loadComponentTranslations]);

    useEffect(() => {
        updateDOMTranslations();
    }, [updateDOMTranslations]);

    const setLang = useCallback((lang) => {
        setCurrentLang(lang);
        Cookies.set('language', lang);
    }, []);

    const translate = useCallback(async (key) => {
        const component = key.split('-')[0];
        const componentTranslations = await loadComponentTranslations(component);
        return componentTranslations[key]?.[currentLang] || key;
    }, [currentLang, loadComponentTranslations]);

    return (
        <LanguageContext.Provider value={{ 
            currentLang, 
            setLang,
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
