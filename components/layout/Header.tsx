"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import SignupButton from '../common/btn-signup';
import CountryBar from '../common/country_bar';
import { CMSText } from '../cms/cms-text';
import { CMSImage } from '../cms/cms-image';
import { useParams, usePathname } from 'next/navigation';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const params = useParams();
    const country = params?.country as string | undefined;
    const lang = params?.lang as string || 'fr';

    // Helper to build paths respecting the current country context
    // If country is present, Home and Staff link to country specific pages
    const getPath = (path: string) => {
        if (country && (path === '/' || path === '/staff')) {
            // Remove trailing slash if root
            return `/${lang}/${country}${path === '/' ? '' : path}`;
        }
        // Ministry, Implicate, Contact, About usually stay global or redirect implicitly
        return `/${lang}${path === '/' ? '' : path}`;
    };

    const NavLink = ({ href, k, defaultVal }: { href: string, k: string, defaultVal: string }) => (
        <Link
            className="text-[1em] font-medium text-[#0f0f0fff] hover:text-[#D8394D] transition-colors"
            href={getPath(href)}
        >
            <CMSText k={k} defaultVal={defaultVal} />
        </Link>
    );

    return (
        <header
            className="fixed w-full top-0 bg-[#fdfff4ff] flex flex-col md:justify-around border-b border-[#878578ff] shadow-sm z-[999]"
        >
            <div className="w-full h-full bg-[#fdfff4ff] flex flex-col border-b border-[#878578ff]">
                <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
                    <Link className="flex items-center gap-2" href={getPath('/')}>
                        <CMSImage k="layout.header.logo" defaultSrc="/images/logo_1st.png" alt="AEE Logo" className="h-12 w-auto object-contain" width={100} height={48} />
                    </Link>
                    
                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6 text-[1em]">
                        <NavLink href="/" k="header.nav.home" defaultVal="Home" />
                        <NavLink href="/about" k="header.nav.about" defaultVal="About" />
                        <NavLink href="/ministry" k="header.nav.ministries" defaultVal="Ministries" />
                        <NavLink href="/implicate" k="header.nav.get_involved" defaultVal="Get Involved" />
                        <NavLink href="/contact" k="header.nav.contact" defaultVal="Contact" />
                        <NavLink href="/staff" k="header.nav.staff" defaultVal="Our Team" />
                    </nav>

                    {/* Desktop Buttons */}
                    <div className="hidden md:block">
                        <SignupButton />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium focus:outline-none md:hidden p-2 hover:bg-zinc-100"
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
                
                {/* Mobile Nav */}
                {menuOpen && (
                    <nav className="flex flex-col md:hidden bg-[#fdfff4ff] border-t border-[#878578ff] animate-in slide-in-from-top-2">
                        <div className="flex flex-col px-4 py-4 gap-4">
                            <Link href={getPath('/')} className="text-lg font-medium" onClick={() => setMenuOpen(false)}>
                                <CMSText k="header.nav.home" defaultVal="Home" />
                            </Link>
                            <Link href={`/${lang}/about`} className="text-lg font-medium" onClick={() => setMenuOpen(false)}>
                                <CMSText k="header.nav.about" defaultVal="About" />
                            </Link>
                            <Link href={`/${lang}/ministry`} className="text-lg font-medium" onClick={() => setMenuOpen(false)}>
                                <CMSText k="header.nav.ministries" defaultVal="Ministries" />
                            </Link>
                            <Link href={`/${lang}/implicate`} className="text-lg font-medium" onClick={() => setMenuOpen(false)}>
                                <CMSText k="header.nav.get_involved" defaultVal="Get Involved" />
                            </Link>
                            <Link href={`/${lang}/contact`} className="text-lg font-medium" onClick={() => setMenuOpen(false)}>
                                <CMSText k="header.nav.contact" defaultVal="Contact" />
                            </Link>
                            <Link href={getPath('/staff')} className="text-lg font-medium" onClick={() => setMenuOpen(false)}>
                                <CMSText k="header.nav.staff" defaultVal="Our Team" />
                            </Link>
                            
                            <div className="mt-2 pt-4 border-t border-zinc-200">
                                <SignupButton />
                            </div>
                        </div>
                    </nav>
                )}
            </div>
            <CountryBar />
        </header>
    );
};

export default Header;
