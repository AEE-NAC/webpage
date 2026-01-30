"use client";

import React, { useEffect } from 'react';
import { useCMS } from './cms-provider';

interface CMSTextProps {
  k: string;
  defaultVal?: string;
  as?: any;
  className?: string;
  [key: string]: any;
}

export const CMSText = ({ k, defaultVal = "", as: Component = "span", className, ...props }: CMSTextProps) => {
  const { dictionary, loading } = useCMS();
  
  // Check if key exists in dictionary
  const val = dictionary?.[k];
  const isFromDB = val !== undefined && val !== null;
  const displayVal = isFromDB ? val : defaultVal;

  useEffect(() => {
    // Only log in production or dev to verify sources
    if (loading) return;

    if (!isFromDB) {
      console.warn(`%c[CMS] Missing Key: "${k}"`, "color: orange; font-weight: bold;", `Using default: "${defaultVal}"`);
    } else {
      // Optional: Uncomment to see successful translations (very verbose)
      // console.debug(`%c[CMS] Loaded: "${k}"`, "color: green;", `Value: "${val}"`);
    }
  }, [k, isFromDB, loading, defaultVal, val]);

  if (loading && !defaultVal) return <span className="opacity-50">...</span>;

  return (
    <Component className={className} {...props} data-cms-key={k} data-cms-source={isFromDB ? 'db' : 'code'}>
      {displayVal}
    </Component>
  );
};
