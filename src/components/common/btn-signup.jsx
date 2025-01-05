import React from 'react';
import LanguageSwitcher from './lang-switcher';
import { useTranslation } from '../../context/Languagecontext';

const SignupButton = () => {
  const { translate, loading } = useTranslation();

  // Afficher un indicateur de chargement si les traductions ne sont pas encore chargées
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className='w-[300px] flex justify-around'>
        <a href='/donation'>
          <button 
            className="items-center text-white bg-[#981a3c] text-white justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground h-10 px-4 py-2 hidden md:inline-flex"
            i18-id="signup-button-donation"
          >
            Donate
          </button>
        </a>
        <a href='/signup'>
          <button 
            className="items-center text-white bg-[#2b2b3f] text-white justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground h-10 px-4 py-2 hidden md:inline-flex"
            i18-id="signup-button-signup"
          >
            Signup
          </button>
        </a>
        <LanguageSwitcher />
      </div>
    </>
  );
};

export default SignupButton;