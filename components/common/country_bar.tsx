"use client";

import React from 'react';
import Link from 'next/link';
import { CMSText } from '../cms/cms-text';
import { usePathname } from 'next/navigation';

const SUPPORTED_COUNTRIES = [
    { code: 'HT', name: 'Haïti',            nameKey: 'shared.impact.country.ht.name' },
    { code: 'SX', name: 'Sint Maarten',     nameKey: 'shared.impact.country.sx.name' },
    { code: 'MF', name: 'Saint Martin',     nameKey: 'shared.impact.country.mf.name' },
    { code: 'MQ', name: 'Martinique',       nameKey: 'shared.impact.country.mq.name' },
    { code: 'GP', name: 'Guadeloupe',       nameKey: 'shared.impact.country.gp.name' },
    { code: 'GF', name: 'Guyane Française', nameKey: 'shared.impact.country.gf.name' },
];

const CountryBar = () => {
    const pathname = usePathname();
    // Default to 'fr' if not found or handled by middleware
    const currentLang = pathname?.split('/')[1] || 'fr'; 

    return (
        <div className="w-full bg-[#981a3c] p-1 flex items-center justify-center shadow-sm">
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
                <a href="https://cefcanada.org/" target="_blank" rel="noopener noreferrer" className="px-4 py-1 text-sm text-white hover:text-white/80 cursor-pointer whitespace-nowrap transition-colors duration-200">
                    <span className="text-white text-sm font-bold">
                        <CMSText k="header.country_bar.canada" defaultVal="Canada" />
                    </span>
                </a>
                {SUPPORTED_COUNTRIES.map((country) => (
                    <Link
                        key={country.code}
                        href={`/${currentLang}/${country.code}`}
                        className="px-4 py-1 text-sm text-white hover:text-white/80 cursor-pointer whitespace-nowrap transition-colors duration-200"
                    >
                        <span className="text-white text-sm font-bold">
                            <CMSText k={country.nameKey} defaultVal={country.name} />
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CountryBar;