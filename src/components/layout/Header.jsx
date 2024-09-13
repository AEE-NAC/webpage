import React from 'react';
import SignupButton from '../common/btn-signup';

const Header = () => (
    <header className="fixed w-full top-0  bg-[#fdfff4ff] border-b border-[#878578ff]" style={{zIndex:999
    }}>
    <div className="container flex items-center justify-between h-16 px-4 md:px-6">
      <a className="flex items-center gap-2" href="#" rel="ugc">
       <img className='h-12 w-12' src='/images/favicon.png'/>
      </a>
      <nav className="hidden md:flex items-center gap-6">
        <a className="text-sm font-medium text-[#0f0f0fff] hover:text-[#D8394D]" href="#" rel="ugc">
          Home
        </a>
        <a className="text-sm font-medium text-[#0f0f0fff] hover:text-[#D8394D]" href="#" rel="ugc">
          About
        </a>
        <a className="text-sm font-medium text-[#0f0f0fff] hover:text-[#D8394D]" href="#" rel="ugc">
          Ministries
        </a>
        <a className="text-sm font-medium text-[#0f0f0fff] hover:text-[#D8394D]" href="#" rel="ugc">
          Weekly Word
        </a>
        <a className="text-sm font-medium text-[#0f0f0fff] hover:text-[#D8394D]" href="#" rel="ugc">
          Blog
        </a>
        <a className="text-sm font-medium text-[#0f0f0fff] hover:text-[#D8394D]" href="#" rel="ugc">
          FAQ
        </a>
      </nav>
      <SignupButton></SignupButton>
      <button
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 md:hidden"
        type="button"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-controls="radix-:r3:"
        data-state="closed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <line x1="4" x2="20" y1="12" y2="12"></line>
          <line x1="4" x2="20" y1="6" y2="6"></line>
          <line x1="4" x2="20" y1="18" y2="18"></line>
        </svg>
        <span className="sr-only">Toggle navigation menu</span>
      </button>
    </div>
  </header>
);

export default Header;
