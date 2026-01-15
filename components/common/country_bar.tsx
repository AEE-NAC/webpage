"use client";

import React from 'react';
import Link from 'next/link';
import { CMSText } from '../cms/cms-text';
const SUPPORTED_COUNTRIES = [
    { code: 'HT', name: 'Haïti' },
    { code: 'SX', name: 'Sint Maarten' },
    { code: 'MF', name: 'Saint Martin' },
    { code: 'MQ', name: 'Martinique' },
    { code: 'GP', name: 'Guadeloupe' },
    { code: 'GF', name: 'Guyane Française' },
];
const CountryBar = () => {
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
                        href={`/country/${country.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="px-4 py-1 text-sm text-white hover:text-white/80 cursor-pointer whitespace-nowrap transition-colors duration-200"
                    >
                        <span className="text-white text-sm font-bold">{country.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CountryBar;