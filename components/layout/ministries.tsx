"use client";

import React from 'react';
import { CMSText } from '../cms/cms-text';
import { CMSImage } from '../cms/cms-image';

const Ministries = () => {
    return (
        <section id="ministries" className="bg-[#fdfff4ff] w-full flex justify-center py-12 md:py-24 lg:py-32">
            <div className="container">
                <div className="space-y-4 text-center">
                    <div className="inline-block rounded-full bg-[#f2e288] px-4 py-1 text-sm text-[#0f0f0fff] font-medium">
                        <CMSText k="home.ministries.badge" defaultVal="Nos Ministères" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#0f0f0fff]">
                        <CMSText k="home.ministries.title" defaultVal="Transformer des vies" />
                    </h2>
                    <p className="text-[#878578ff] max-w-2xl mx-auto">
                        <CMSText k="home.ministries.desc" defaultVal="Découvrez comment nous impactons la communauté." />
                    </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 p-6">
                    {/* Card 1 */}
                    <div className="text-card-foreground shadow-sm bg-[#fdfff4ff] border border-[#878578ff] rounded-2xl overflow-hidden">
                        <div className="p-6 space-y-4">
                            <CMSImage
                                k="home.ministries.card1.image"
                                defaultSrc="/images/CBN_haiti.jpeg"
                                width={400}
                                height={250}
                                alt="Ministry 1"
                                className="w-full h-48 object-cover rounded-2xl"
                                style={{ aspectRatio: '400 / 250', objectFit: 'cover' }}
                            />
                            <h3 className="text-xl font-semibold text-[#0f0f0fff]">
                                <CMSText k="home.ministries.card1.title" defaultVal="Club Bonne Nouvelle" />
                            </h3>
                            <p className="text-[#878578ff]">
                                <CMSText k="home.ministries.card1.desc" defaultVal="Description du club bonne nouvelle..." />
                            </p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="text-card-foreground shadow-sm bg-[#fdfff4ff] border border-[#878578ff] rounded-2xl overflow-hidden">
                        <div className="p-6 space-y-4">
                            <CMSImage
                                k="home.ministries.card2.image"
                                defaultSrc="/images/font_1.jpg"
                                width={400}
                                height={250}
                                alt="Ministry 2"
                                className="w-full h-48 object-cover rounded-2xl"
                                style={{ aspectRatio: '400 / 250', objectFit: 'cover' }}
                            />
                            <h3 className="text-xl font-semibold text-[#0f0f0fff]">
                                <CMSText k="home.ministries.card2.title" defaultVal="Club 5 Jours" />
                            </h3>
                            <p className="text-[#878578ff]">
                                <CMSText k="home.ministries.card2.desc" defaultVal="Description du club 5 jours..." />
                            </p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="text-card-foreground shadow-sm bg-[#fdfff4ff] border border-[#878578ff] rounded-2xl overflow-hidden">
                        <div className="p-6 space-y-4">
                            <CMSImage
                                k="home.ministries.card3.image"
                                defaultSrc="/images/CP_pichon.jpeg"
                                width={400}
                                height={250}
                                alt="Ministry 3"
                                className="w-full h-48 object-cover rounded-2xl"
                                style={{ aspectRatio: '400 / 250', objectFit: 'cover' }}
                            />
                            <h3 className="text-xl font-semibold text-[#0f0f0fff]">
                                <CMSText k="home.ministries.card3.title" defaultVal="CYIA" />
                            </h3>
                            <p className="text-[#878578ff]">
                                <CMSText k="home.ministries.card3.desc" defaultVal="Christian Youth In Action description..." />
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Ministries;