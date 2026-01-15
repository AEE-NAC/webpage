"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import SignupButton from '../common/btn-signup';
import CountryBar from '../common/country_bar';
import { CMSText } from '../cms/cms-text';
import { CMSImage } from '../cms/cms-image';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const NavLink = ({ href, k, defaultVal }: { href: string, k: string, defaultVal: string }) => (
        <Link
            className="text-[1em] font-medium text-[#0f0f0fff] hover:text-[#D8394D] transition-colors"
            href={href}
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
                    <Link className="flex items-center gap-2" href="/">
                        <CMSImage k="layout.header.logo" defaultSrc="/images/logo_1st.png" alt="AEE Logo" className="h-12 w-auto object-contain" width={100} height={48} />
                    </Link>
                    
                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6 text-[1em]">
                        <NavLink href="/" k="header.nav.home" defaultVal="Accueil" />
                        <NavLink href="/about" k="header.nav.about" defaultVal="À Propos" />
                        <NavLink href="/#ministries" k="header.nav.ministries" defaultVal="Ministères" />
                        <NavLink href="/implicate" k="header.nav.get_involved" defaultVal="S'impliquer" />
                        <NavLink href="/contact" k="header.nav.contact" defaultVal="Contact" />
                        <NavLink href="/staff" k="header.nav.staff" defaultVal="Notre Équipe" />
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
                            <Link href="/" className="text-lg font-medium" onClick={() => setMenuOpen(false)}>
                                <CMSText k="header.nav.home" defaultVal="Accueil" />
                            </Link>
                            <Link href="/about" className="text-lg font-medium" onClick={() => setMenuOpen(false)}>
                                <CMSText k="header.nav.about" defaultVal="À Propos" />
                            </Link>
                            <Link href="/#ministries" className="text-lg font-medium" onClick={() => setMenuOpen(false)}>
                                <CMSText k="header.nav.ministries" defaultVal="Ministères" />
                            </Link>
                            <Link href="/implicate" className="text-lg font-medium" onClick={() => setMenuOpen(false)}>
                                <CMSText k="header.nav.get_involved" defaultVal="S'impliquer" />
                            </Link>
                            <Link href="/contact" className="text-lg font-medium" onClick={() => setMenuOpen(false)}>
                                <CMSText k="header.nav.contact" defaultVal="Contact" />
                            </Link>
                            <Link href="/staff" className="text-lg font-medium" onClick={() => setMenuOpen(false)}>
                                <CMSText k="header.nav.staff" defaultVal="Notre Équipe" />
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
