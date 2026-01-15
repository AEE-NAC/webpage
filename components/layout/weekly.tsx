"use client";

import React from 'react';
import { CMSText } from '../cms/cms-text';
import { CMSImage } from '../cms/cms-image';

const WeeklyWord = () => {
  return (
    <section id="weekly-word" className="px-[26px] w-full flex justify-center py-12 md:py-24 lg:py-32">
      <div className="container p-6 rounded-[12px] bg-[#423c5eff] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-block rounded-full bg-[#f2e288] px-4 py-1 text-sm text-[#0f0f0fff] font-medium">
             <CMSText k="home.weekly_highlight.badge" defaultVal="Weekly Word" />
          </div>
          <h2 className="text-3xl font-bold text-[#fdfff4ff]">
             <CMSText k="home.weekly_highlight.title" defaultVal="What is FRET? How would you define it?" />
          </h2>
          <div className="text-[#bdbdbcff]">
             <CMSText 
                as="p"
                k="home.weekly_highlight.desc" 
                defaultVal="FRET is more common than you think..." 
             />
          </div>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-[#981a3c] text-white hover:bg-[#7a1530] h-10 px-4 py-2">
             <CMSText k="home.weekly_highlight.cta" defaultVal="Read More" />
          </button>
        </div>
        <div>
          <CMSImage
            k="home.weekly_highlight.image"
            defaultSrc="/images/CBN_haiti.jpeg"
            width={600}
            height={400}
            alt="Weekly Highlight"
            className="rounded-2xl w-full object-cover"
            style={{ aspectRatio: '600 / 400', objectFit: 'cover' }}
          />
        </div>
      </div>
    </section>
  );
};

export default WeeklyWord;