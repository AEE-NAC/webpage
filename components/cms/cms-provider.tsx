"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { CMSDictionary } from '@/services/types';

interface CMSContextType {
  dictionary: CMSDictionary;
}

const CMSContext = createContext<CMSContextType>({ dictionary: {} });

export const useCMS = () => useContext(CMSContext);

export const CMSProvider = ({ 
  dictionary, 
  children 
}: { 
  dictionary: CMSDictionary; 
  children: ReactNode; 
}) => {
  return (
    <CMSContext.Provider value={{ dictionary }}>
      {children}
    </CMSContext.Provider>
  );
};
