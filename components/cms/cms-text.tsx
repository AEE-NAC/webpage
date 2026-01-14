"use client";

import React from 'react';
import { useCMS } from './cms-provider';

interface CMSTextProps {
  k: string;
  defaultVal?: string;
  as?: any; 
  className?: string;
  [key: string]: any;
}

export const CMSText = ({ k, defaultVal, as: Tag = 'span', className, ...props }: CMSTextProps) => {
  const { dictionary } = useCMS();
  
  // Logic: 
  // 1. Try to find key in Supabase dictionary
  // 2. Fallback to defaultVal provided in code
  // 3. Fallback to key itself
  const val = dictionary[k] || defaultVal || k;

  return (
    <Tag 
      className={className}
      data-cms-key={k}
      style={{ cursor: 'context-menu' }}
      {...props}
    >
      {val}
    </Tag>
  );
};
