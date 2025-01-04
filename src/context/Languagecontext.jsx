import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState('en');
  const [translations, setTranslations] = useState({});

  // Load translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/lang/translations/${currentLang}.json`);
        const data = await response.json();
        console.log(data);
        setTranslations(data);
        updateDOMTranslations(data); // Update DOM translations immediately after loading new translations
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };

    loadTranslations();
  }, [currentLang]);

  // Automatically update translations when `translations` changes
  useEffect(() => {
    updateDOMTranslations(translations);
  }, [translations]);

  // Update DOM elements with translations
  const updateDOMTranslations = (translationsData) => {
    console.log('Updating DOM translations:', translationsData);
    const elements = document.querySelectorAll('[i18-id]');
    console.log('Found elements:', elements)
    elements.forEach(element => {
      const translationKey = element.getAttribute('i18-id');
      console.log('Translation key:', translationKey);
      const translation = translationsData[translationKey];
        console.log('Translation:', translation);
      if (translationsData[translationKey]) {
        element.textContent = translationsData[translationKey];
      }
    });
  };

  // Function to get translation by key (optional for dynamic use cases)
  const translate = (key) => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLang, 
      setLang: setCurrentLang,
      translate,
      translations 
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

