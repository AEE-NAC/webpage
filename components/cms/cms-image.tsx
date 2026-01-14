"use client";

import React from 'react';
import Image, { ImageProps } from 'next/image';
import { useCMS } from './cms-provider';

interface CMSImageProps extends Omit<ImageProps, 'src'> {
  k: string;
  defaultSrc: string;
}

export const CMSImage = ({ k, defaultSrc, alt, ...props }: CMSImageProps) => {
  const { dictionary } = useCMS();
  // 1. Resolve source (CMS > Default)
  const src = dictionary[k] || defaultSrc;

  // 2. Check if it's a remote URL (Uploaded via CMS) vs Local Asset
  const isRemote = src.startsWith('http') || src.startsWith('https');

  // If remote, use standard <img> to avoid 'Next.js Image Hostname' config errors during dev/testing
  if (isRemote) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        data-cms-key={k}
        className={props.className}
        style={{ ...props.style, cursor: 'context-menu', objectFit: 'contain' }}
        width={props.width}
        height={props.height}
      />
    );
  }

  // Use Optimized Next Image for local assets
  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      // @ts-ignore - data attributes are passed to underlying img
      data-cms-key={k}
      style={{ ...props.style, cursor: 'context-menu' }}
    />
  );
};
