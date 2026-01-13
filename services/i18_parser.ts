export type Dictionary = {
  [key: string]: string | Dictionary;
};

/**
 * Parses a string and replaces patterns like {{section.subsection.key.lang}}
 * with the corresponding value from the dictionary.
 * The last segment of the path is treated as the language code.
 * Example: {{home.hero.title.en}} looks for home -> hero -> title in the 'en' dictionary provided (or handles structure differently depending on your preferred root).
 * 
 * Assuming the structure: Dictionary -> Section -> Key -> Language Value
 * OR
 * Structure: Dictionary -> Language -> Section -> Key (Standard practice)
 * 
 * Based on your request: "keys and language this way: {{pages.keys.language}}"
 * This implies the structure is object -> keys -> value_by_language
 */
export const i18nParser = (template: string, dictionary: Dictionary): string => {
  const regex = /\{\{([\w\d_.]+)\}\}/g; // Matches {{any.thing.here}}

  return template.replace(regex, (match, pathString) => {
    const parts = pathString.split('.');
    
    // We need at least a key and a language
    if (parts.length < 2) {
      return match;
    }

    const language = parts.pop(); // The last part is the language
    const path = parts; // The rest is the path to the key

    // Traverse the dictionary
    let current: string | Dictionary | undefined = dictionary;

    // 1. Traverse to the node
    for (const key of path) {
      if (typeof current === 'object' && current !== null && key in current) {
        current = current[key];
      } else {
        return match; // Key path not found
      }
    }

    // 2. At the specific node, look for the language
    if (typeof current === 'object' && current !== null && language && language in current) {
       const translation = current[language];
       if (typeof translation === 'string') {
         return translation;
       }
    }

    // Return original if not found or if the end value isn't a string
    return match;
  });
};

/**
 * Helper to get a specific value without string replacement
 */
export const getTranslation = (pathString: string, dictionary: Dictionary): string | null => {
   const parts = pathString.split('.');
   const language = parts.pop(); 
   
   let current: any = dictionary;
   
   for (const key of parts) {
      if (current && current[key]) {
          current = current[key];
      } else {
          return null;
      }
   }

   if (current && language && current[language]) {
       return current[language];
   }
   
   return null;
};
