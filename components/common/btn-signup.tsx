"use client";

import React from 'react';
import Link from 'next/link';
import LanguageSwitcher from './lang-switcher';
import { CMSText } from '../cms/cms-text';

const SignupButton = () => {
  return (
    <>
      <div className='w-[300px] flex justify-around items-center'>
        <Link href='/donation'>
          <button 
            className="items-center bg-[#981a3c] text-white justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 hidden md:inline-flex hover:bg-[#7a1530]"
          >
            <CMSText k="header.btn.donate" defaultVal="Donate" />
          </button>
        </Link>
        <Link href='/newsletter'>
          <button 
            className="items-center bg-[#2b2b3f] text-white justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 hidden md:inline-flex hover:bg-[#1f1f2e]"
          >
            <CMSText k="header.btn.join" defaultVal="Join Us" />
          </button>
        </Link>
        <LanguageSwitcher />
      </div>
    </>
  );
};

export default SignupButton;