import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState('en');
  const [translationsCache, setTranslationsCache] = useState({}); // Cache for loaded component translations

  // Load translations for a specific component
  const loadComponentTranslations = async (component) => {
    if (translationsCache[component]) {
      // If already cached, return immediately
      return translationsCache[component];
    }

    try {
      const response = await fetch(`/lang/translations/${component}.json`);
      const data = await response.json();
      setTranslationsCache((prevCache) => ({
        ...prevCache,
        [component]: data,
      }));
      return data;
    } catch (error) {
      console.error(`Failed to load translations for ${component}:`, error);
      return {};
    }
  };

  // Update DOM translations for all elements
  const updateDOMTranslations = async () => {
    const elements = document.querySelectorAll('[i18-id]');
    const componentsToLoad = new Set();

    // Extract unique component names from `i18-id` attributes
    elements.forEach((element) => {
      const i18Id = element.getAttribute('i18-id');
      const component = i18Id.split('-')[0];
      componentsToLoad.add(component);
    });

    // Load translations for all required components
    const loadedTranslations = {};
    await Promise.all(
      Array.from(componentsToLoad).map(async (component) => {
        const data = await loadComponentTranslations(component);
        loadedTranslations[component] = data;
      })
    );

    // Update the DOM with the correct translations
    elements.forEach((element) => {
      const i18Id = element.getAttribute('i18-id');
      const component = i18Id.split('-')[0];
      const translationKey = i18Id;
      const translation = loadedTranslations[component]?.[translationKey]?.[currentLang];

      if (translation) {
        element.textContent = translation;
      }
    });
  };

  // Watch for changes in language and refresh translations
  useEffect(() => {
    updateDOMTranslations();
  }, [currentLang]);

  // Function to get translation dynamically
  const translate = async (key) => {
    const component = key.split('-')[0];
    const componentTranslations = await loadComponentTranslations(component);
    return componentTranslations[key]?.[currentLang] || key;
  };

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

// Custom hook for easy access
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
