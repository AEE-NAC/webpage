"use client";

import React from 'react';
import { useCMS } from './cms-provider';

interface CMSVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
    k: string;
    defaultSrc: string;
}

export const CMSVideo = ({ k, defaultSrc, className, ...props }: CMSVideoProps) => {
    const { dictionary } = useCMS();
    const src = dictionary[k] || defaultSrc;

    return (
        <video
            src={src}
            data-cms-key={k}
            className={className}
            {...props}
        />
    );
};
