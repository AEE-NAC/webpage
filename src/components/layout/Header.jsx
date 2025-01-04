import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SignupButton from '../common/btn-signup';

const Header = () => {
    const { t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header
            className="fixed w-full top-0 bg-[#fdfff4ff] flex justify-around border-b border-[#878578ff]"
            style={{ zIndex: 999 }}
        >
            <div className="container flex items-center justify-between h-16 px-4 md:px-6">
                <a className="flex items-center gap-2" href="#" rel="ugc">
                    <img className="h-12 w-full" src="/images/logo_1st.png" alt="Logo" />
                </a>
                {/* Navigation pour les écrans moyens et plus grands */}
                <nav className="hidden md:flex items-center gap-6 text-[1em]">
                    <a
                        className="text-[1em] font-medium text-[#0f0f0fff] hover:text-[#D8394D]"
                        href="../"
                        rel="ugc"
                        i18-id="header-home"
                    >
                        {t('header-home')}
                    </a>
                    <a
                        className="text-[1em] font-medium text-[#0f0f0fff] hover:text-[#D8394D]"
                        href="../apropos"
                        rel="ugc"
                        i18-id="header-about"
                    >
                        {t('header-about')}
                    </a>
                    <a
                        className="text-[1em] font-medium text-[#0f0f0fff] hover:text-[#D8394D]"
                        href="../#ministries"
                        rel="ugc"
                        i18-id="header-ministries"
                    >
                        {t('header-ministries')}
                    </a>
                    <a
                        className="text-[1em] font-medium text-[#0f0f0fff] hover:text-[#D8394D]"
                        href="../implicate"
                        rel="ugc"
                        i18-id="header-get-involved"
                    >
                        {t('header-get-involved')}
                    </a>
                    <a
                        className="text-[1em] font-medium text-[#0f0f0fff] hover:text-[#D8394D]"
                        href="#"
                        rel="ugc"
                        i18-id="header-contact-us"
                    >
                        {t('header-contact-us')}
                    </a>
                </nav>
                {/* Bouton d'inscription */}
                <SignupButton />
                {/* Bouton du menu mobile */}
                
                <button
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 md:hidden"
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? (
                        // Icône de fermeture
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <line
                                x1="18"
                                y1="6"
                                x2="6"
                                y2="18"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <line
                                x1="6"
                                y1="6"
                                x2="18"
                                y2="18"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                        </svg>
                    ) : (
                        // Icône hamburger
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <line x1="4" y1="6" x2="20" y2="6" strokeWidth="2" />
                            <line x1="4" y1="12" x2="20" y2="12" strokeWidth="2" />
                            <line x1="4" y1="18" x2="20" y2="18" strokeWidth="2" />
                        </svg>
                    )}
                    <span className="sr-only">{t('header-toggle-navigation')}</span>
                </button>
            </div>
            {/* Menu mobile */}
            {menuOpen && (
                <nav className="md:hidden bg-[#fdfff4ff] border-b border-[#878578ff]">
                    <div className="container px-4 py-4">
                        <a
                            className="block py-2 text-[1em] font-medium text-[#0f0f0fff] hover:text-[#D8394D]"
                            href="../"
                            rel="ugc"
                            i18-id="header-home"
                        >
                            {t('header-home')}
                        </a>
                        <a
                            className="block py-2 text-[1em] font-medium text-[#0f0f0fff] hover:text-[#D8394D]"
                            href="../apropos"
                            rel="ugc"
                            i18-id="header-about"
                        >
                            {t('header-about')}
                        </a>
                        <a
                            className="block py-2 text-[1em] font-medium text-[#0f0f0fff] hover:text-[#D8394D]"
                            href="../#ministries"
                            rel="ugc"
                            i18-id="header-ministries"
                        >
                            {t('header-ministries')}
                        </a>
                        <a
                            className="block py-2 text-[1em] font-medium text-[#0f0f0fff] hover:text-[#D8394D]"
                            href="../implicate"
                            rel="ugc"
                            i18-id="header-get-involved"
                        >
                            {t('header-get-involved')}
                        </a>
                        <a
                            className="block py-2 text-[1em] font-medium text-[#0f0f0fff] hover:text-[#D8394D]"
                            href="#"
                            rel="ugc"
                            i18-id="header-contact-us"
                        >
                            {t('header-contact-us')}
                        </a>
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Header;