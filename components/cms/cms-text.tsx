"use client";

import React from 'react';

interface CMSTextProps {
  k: string;
  defaultVal?: string;
  as?: any; 
  className?: string;
  [key: string]: any;
}

export const CMSText = ({ k, defaultVal, as: Tag = 'span', className, ...props }: CMSTextProps) => {
  return (
    <Tag 
      className={className}
      data-cms-key={k}
      style={{ cursor: 'context-menu' }}
      {...props}
    >
      {defaultVal || k}
    </Tag>
  );
};
