import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { LanguageContext } from '../../context/Languagecontext';

const Container = styled.div`
  position: relative;
`;

const LangButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  color: #2b2b3f !important;
  border: 1px solid #981a3c;
  background: #fdfff4ff;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f5f5f5;
  }
`;

// Update the Dropdown styled component to use a prop function
const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 999;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: ${({ $isOpen }) => $isOpen ? 'block' : 'none'};
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f5f5f5;
  }
`;

const Flag = styled.img`
  width: 20px;
  height: 15px;
  border-radius: 2px;
`;

const LanguageSwitcher = () => {
  const { currentLang, setLang } = useContext(LanguageContext);
  const [userCountry, setUserCountry] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        setUserCountry(data.country_code.toLowerCase());
        if (!currentLang) {
          setLang(browserLang);
        }
      });
      
    // Close dropdown when clicking outside
    const handleClickOutside = () => setIsOpen(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const languages = [
    { code: 'en', country: 'us', name: 'EN' },
    { code: 'fr', country: 'fr', name: 'FR' },
    { code: 'es', country: 'es', name: 'ES' },
    {code:'kr',country:'ht',name:'KR'}
  ];

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  const handleButtonClick = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const selectLanguage = (langCode) => {
    setLang(langCode);
    setIsOpen(false);
  };

  return (
    <Container>
      <LangButton onClick={(e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }}>
        <Flag 
          src={`https://flagcdn.com/w20/${currentLanguage.country}.png`} 
          alt={currentLanguage.name}
        />
        <span>{currentLanguage.name}</span>
      </LangButton>
      <Dropdown $isOpen={isOpen}> {/* Use $isOpen instead of isOpen */}
        {languages.map(lang => (
          <DropdownItem 
            key={lang.code}
            onClick={() => selectLanguage(lang.code)}
          >
            <Flag 
              src={`https://flagcdn.com/w20/${lang.country}.png`} 
              alt={lang.name}
            />
            <span>{lang.name}</span>
          </DropdownItem>
        ))}
      </Dropdown>
    </Container>
  );
};

export default LanguageSwitcher;