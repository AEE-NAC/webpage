import React from 'react';
import Navbar from '../common/nav';
import SignupButton from '../common/btn-signup';
import LanguageSelector from '../common/LanguageSelector';
import { BiBorderRadius } from 'react-icons/bi';
const Header = () => {

    const handleLanguageChange = (lang) => {
        console.log('Selected language:', lang);
        // Add logic here to handle the language change
      };

    return (
            <>
            <div className='bg-transparent flex flex-row w-full items-center justify-between'>
            <div className=" top-0 left-0 p-4">
        <img src="/images/logo@1x.png" alt="DJONDJON Logo" className="w-50 h-16"/>
           </div>
                <Navbar  className="h-16 " style={{width:352 ,BorderRadius:50}}></Navbar>
                <SignupButton className="relative right-25"></SignupButton>
                <LanguageSelector  onLanguageChange={handleLanguageChange}  ></LanguageSelector>
            </div>
            </>
    );
};

export default Header;
