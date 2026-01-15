"use client";

import React from 'react';
import Link from 'next/link';
import { CMSText } from '../cms/cms-text';
import { CMSImage } from '../cms/cms-image';
import { useCMS } from '../cms/cms-provider';

const Footer = () => {
    const { dictionary } = useCMS();
    
    // Fetch Social URLs from CMS (with defaults)
    const socialLinks = {
        facebook: dictionary['footer.social.facebook'] || '#!',
        instagram: dictionary['footer.social.instagram'] || '#!',
        google: dictionary['footer.social.google'] || '#!',
        x: dictionary['footer.social.x'] || '#!'
    };

    return (
        <footer className="py-8 px-8 bg-[#fcfcfc] text-[#2a2c41] border-t border-zinc-200">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    <div className="text-center md:text-left flex flex-col items-center md:items-start">
                        <CMSImage k="layout.footer.logo" defaultSrc="/images/logo_1st.png" alt="AEE Logo" className="w-[120px] h-auto object-contain" width={120} height={120} />
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-black">
                            <CMSText k="footer.quick_links.title" defaultVal="Quick Links" />
                        </h3>
                        <ul className="space-y-2">
                            <li><Link className="hover:underline text-[#981a3c]" href="/"><CMSText k="header.nav.home" defaultVal="Home" /></Link></li>
                            <li><Link className="hover:underline text-[#981a3c]" href="/about"><CMSText k="header.nav.about" defaultVal="About" /></Link></li>
                            <li><Link className="hover:underline text-[#981a3c]" href="/#ministries"><CMSText k="header.nav.ministries" defaultVal="Ministries" /></Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-black">
                            <CMSText k="footer.support.title" defaultVal="Support" />
                        </h3>
                        <ul className="space-y-2">
                            <li><Link className="hover:underline text-[#981a3c]" href="/faq"><CMSText k="footer.support.faq" defaultVal="FAQs" /></Link></li>
                            <li><Link className="hover:underline text-[#981a3c]" href="/contact"><CMSText k="footer.support.contact" defaultVal="Contact Us" /></Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-black">
                             <CMSText k="footer.about.title" defaultVal="CEF" />
                        </h3>
                        <p className="text-black text-sm">
                             <CMSText k="footer.about.desc" defaultVal="Child Evangelism Fellowship. Evangelizing children with the Word of God." />
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-8 border-t border-zinc-200 space-y-4 md:space-y-0">
                    <div>
                        <p className="text-black text-xs">
                             &copy; {new Date().getFullYear()} <CMSText k="footer.copyright" defaultVal="CEF Global. All rights reserved." />
                        </p>
                    </div>
                    <div className="flex space-x-4">
                        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-[#1877f2] hover:opacity-80 transition-opacity">
                            {/* Hidden span to register key in CMS */}
                            <span className="hidden" data-cms-key="footer.social.facebook">{socialLinks.facebook}</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-[#c13584] hover:opacity-80 transition-opacity">
                            <span className="hidden" data-cms-key="footer.social.instagram">{socialLinks.instagram}</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </a>
                         <a href={socialLinks.google} target="_blank" rel="noopener noreferrer" className="text-[#ea4335] hover:opacity-80 transition-opacity">
                            <span className="hidden" data-cms-key="footer.social.google">{socialLinks.google}</span>
                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>
                        </a>
                         <a href={socialLinks.x} target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-80 transition-opacity">
                            <span className="hidden" data-cms-key="footer.social.x">{socialLinks.x}</span>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;