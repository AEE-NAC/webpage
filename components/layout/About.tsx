"use client";

import React from 'react';
import { CMSText } from '../cms/cms-text';
import { CMSImage } from '../cms/cms-image';

const About = () => (
    <section id="about" className="bg-transparent px-[26px] w-full flex justify-center min-h-screen items-center py-12 md:py-24 lg:py-32">
        <div>
            <div className="bg-[#e45a83ff] rounded-[12px] p-6 container grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-white">
                <div>
                    <CMSImage
                        k="home.about.image"
                        defaultSrc="/images/font_1.jpg"
                        width={600}
                        height={400}
                        alt="About Us"
                        className="rounded-2xl w-full object-cover"
                        style={{ aspectRatio: '600 / 400', objectFit: 'cover' }}
                    />
                </div>
                <div className="space-y-4">
                    <div className="inline-block rounded-full bg-[#f2e288] px-4 py-1 text-sm text-[#0f0f0fff] font-medium">
                        <CMSText k="home.about.badge" defaultVal="Who We Are" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#0f0f0fff] dark:text-white">
                        <CMSText k="home.about.title" defaultVal="Empowering Children, Transforming Lives" />
                    </h2>
                    <div className="text-[#010000] dark:text-zinc-100">
                        <CMSText 
                            as="p"
                            k="home.about.desc" 
                            defaultVal="Children's Hope is a non-profit Christian organization dedicated to providing education, healthcare, and spiritual guidance to underprivileged children around the world." 
                        />
                    </div>
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-[#981a3c] text-white hover:bg-[#7a1530] h-10 px-4 py-2">
                         <CMSText k="home.about.cta" defaultVal="Learn More" />
                    </button>
                </div>
            </div>
        </div>
    </section>
);

export default About;