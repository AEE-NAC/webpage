import { CMSDictionary } from "./types";

/**
 * Basic Translator for Atomic CMS
 * Since the generic CMS Service already resolves the correct language/region value,
 * we just need to look up the key.
 * 
 * Usage: t('home.hero.title') -> returns the value appropriate for the current user
 */
export const translator = (dictionary: CMSDictionary) => {
  return {
    t: (key: string, defaultVal: string = ''): string => {
      if (dictionary[key]) return dictionary[key];
      
      // Optional: Supports nested object lookup if you decide to keep JSON structure
      // But purely atomic 'key' -> 'value' is faster.
      return defaultVal || key;
    },
    
    // Renders HTML content safely (use with dangerouslySetInnerHTML)
    html: (key: string, defaultVal: string = ''): string => {
      return dictionary[key] || defaultVal;
    },

    // Gets an image URL
    src: (key: string, fallbackUrl: string): string => {
      return dictionary[key] || fallbackUrl;
    }
  };
};

// Legacy support if you still use nested objects locally
export const i18nParser = (template: string, dictionary: any): string => {
  const regex = /\{\{([\w\d_.]+)\}\}/g; // Matches {{any.thing.here}}
  return template.replace(regex, (match, pathString) => {
      // Direct lookup in flat dictionary first
      if (dictionary[pathString]) return dictionary[pathString];
      return match;
  });
};
