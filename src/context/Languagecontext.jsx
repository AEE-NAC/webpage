import React, { createContext, useState } from 'react';

// Create the language context
export const LanguageContext = createContext();

// Create a provider component for the language context
export const LanguageProvider = ({ children }) => {
    // State to hold the selected language
    const [language, setLanguage] = useState('en');

    // Function to update the selected language
    const updateLanguage = (newLanguage) => {
        console.log(newLanguage)
        setLanguage(newLanguage);
    };

    // Value object to be provided by the context
    const value = {
        language,
        updateLanguage,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};