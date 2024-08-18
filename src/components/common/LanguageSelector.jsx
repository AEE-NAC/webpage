import React, { useContext, useState } from 'react';
import { LanguageContext } from '../../context/Languagecontext';
const languages = [
  { code: 'FR', flag: '/images/flags/FR.png', label: 'French' },
  { code: 'EN', flag: '/images/flags/EN.png', label: 'English' },
  { code: 'KR', flag: '/images/flags/KR.png', label: '' },
];

const LanguageSelector = ({ onLanguageChange }) => {
  const {language, updateLanguage}=useContext(LanguageContext);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    updateLanguage(lang.code);
    setDropdownVisible(false);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  return (
    <div className="relative h-12 w-20 right-8  inline-block text-left">
      <div
        className="rounded-full bg-black h-full w-full text-white p-2 flex items-center justify-center cursor-pointer"
        onClick={() => setDropdownVisible(!dropdownVisible)}
      >
        <img src={selectedLanguage.flag} alt={selectedLanguage.label} className="w-6 h-6 rounded-full" />
        <span className="ml-2 text-xl">{selectedLanguage.code}</span>
      </div>
      {dropdownVisible && (
        <div className="absolute flex items-center right-0 mt-2 w-20 rounded-[12px] bg-black ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang)}
                className="flex items-center justify-center w-full bg-black px-4 py-2 text-sm text-white "
              >
                <img src={lang.flag} alt={lang.label} className="w-6 h-6 rounded-full" />
                <span className="ml-2 text-xl">{lang.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
