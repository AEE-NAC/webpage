import { GeoLocation } from './ip';

export type SupportedLanguage = 'en' | 'fr' | 'es' | 'ht';

export const locales: SupportedLanguage[] = ['en', 'fr', 'es', 'ht'];
export const defaultLocale: SupportedLanguage = 'en';

// Listes de codes pays ISO Alpha-2
const FRANCOPHONE_COUNTRIES = [
    'FR', 'BE', 'CH', 'CA', 'LU', 'MC', // Europe / Amerique du nord
    'SN', 'CI', 'CM', 'MA', 'DZ', 'TN', 'MG', 'CD', 'CG', 'GA', 'BF', 'NE', 'ML', 'TG', 'BJ' // Afrique
];

const HISPANOPHONE_COUNTRIES = [
    'ES', // Europe
    'MX', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'GQ' // Amerique Latine / Afrique
];

/**
 * Récupère la langue du navigateur (ex: 'fr-FR' -> 'fr')
 */
const getBrowserLanguage = (): string => {
    if (typeof navigator === 'undefined') return 'en';
    return (navigator.language || (navigator as any).userLanguage || 'en').split('-')[0];
};

/**
 * Détermine la langue de l'interface en fonction des règles métier
 */
export const resolveUserLanguage = (location: GeoLocation | null): SupportedLanguage => {
    const browserLang = getBrowserLanguage();
    const countryCode = location?.country_code;

    // --- REGLE 1 : Exception Spécifique pour Haïti ---
    // "Le créole haïtien soit réservé pour Haïti"
    if (countryCode === 'HT') {
        return 'ht';
    }

    // --- REGLE 2 : Compatibilité Navigateur ---
    // Si l'utilisateur a explicitement une langue supportée dans son navigateur, on l'utilise.
    // Cela permet à un anglophone en France d'avoir l'anglais, ou un hispanophone au Canada d'avoir l'espagnol.
    if (browserLang === 'fr') return 'fr';
    if (browserLang === 'es') return 'es';
    if (browserLang === 'ht') return 'ht';
    if (browserLang === 'en') return 'en';

    // --- REGLE 3 : Fallback Basé sur la Région (Si langue navigateur non supportée ex: Russe) ---
    // "Pays francophones ait le français, pays qui parle l'espagnol ait l'espagnol"
    if (countryCode) {
        if (FRANCOPHONE_COUNTRIES.includes(countryCode)) {
            return 'fr';
        }
        if (HISPANOPHONE_COUNTRIES.includes(countryCode)) {
            return 'es';
        }
    }

    // --- REGLE 4 : Défaut Anglophone / Reste du monde ---
    // "Pour que les pays anglophones ait l'anglais qui sera la langues par défaut"
    return 'en';
};