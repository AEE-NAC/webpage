import React from 'react';
import { useTranslation } from 'react-i18next';

const Ministries = () => {
    const { t } = useTranslation();

    return (
        <section id="ministries" className="bg-[#fdfff4ff] w-full flex justify-center py-12 md:py-24 lg:py-32">
            <div className="container">
                <div className="space-y-4 text-center">
                    <div className="inline-block rounded-full bg-[#f2e288] px-4 py-1 text-sm text-[#0f0f0fff]" i18-id="ministries-title">
                        {t('ministries-title')}
                    </div>
                    <h2 className="text-3xl font-bold text-[#0f0f0fff]" i18-id="ministries-transform-lives">
                        {t('ministries-transform-lives')}
                    </h2>
                    <p className="text-[#878578ff]" i18-id="ministries-description">
                        {t('ministries-description')}
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 p-6">
                    <div
                        className="text-card-foreground shadow-sm bg-[#fdfff4ff] border border-[#878578ff] rounded-2xl overflow-hidden"
                        data-v0-t="card"
                    >
                        <div className="p-6 space-y-4">
                            <img
                                src="/images/CBN_haiti.jpeg"
                                width="400"
                                height="250"
                                alt="Article de Blog 1"
                                className="w-full h-48 object-cover rounded-2xl"
                                style={{ aspectRatio: '400 / 250', objectFit: 'cover' }}
                            />
                            <h3 className="text-xl font-semibold text-[#0f0f0fff]" i18-id="ministries-club-of-good-news">
                                {t('ministries-club-of-good-news')}
                            </h3>
                            <p className="text-[#878578ff]" i18-id="ministries-club-of-good-news-description">
                                {t('ministries-club-of-good-news-description')}
                            </p>
                        </div>
                    </div>
                    <div
                        className="text-card-foreground shadow-sm bg-[#fdfff4ff] border border-[#878578ff] rounded-2xl overflow-hidden"
                        data-v0-t="card"
                    >
                        <div className="p-6 space-y-4">
                            <img
                                src="/images/font_1.jpg"
                                width="400"
                                height="250"
                                alt="Article de Blog 1"
                                className="w-full h-48 object-cover rounded-2xl"
                                style={{ aspectRatio: '400 / 250', objectFit: 'cover' }}
                            />
                            <h3 className="text-xl font-semibold text-[#0f0f0fff]" i18-id="ministries-5-day-club">
                                {t('ministries-5-day-club')}
                            </h3>
                            <p className="text-[#878578ff]" i18-id="ministries-5-day-club-description">
                                {t('ministries-5-day-club-description')}
                            </p>
                        </div>
                    </div>
                    <div
                        className="text-card-foreground shadow-sm bg-[#fdfff4ff] border border-[#878578ff] rounded-2xl overflow-hidden"
                        data-v0-t="card"
                    >
                        <div className="p-6 space-y-4">
                            <img
                                src="/images/CP_pichon.jpeg"
                                width="400"
                                height="250"
                                alt="Article de Blog 1"
                                className="w-full h-48 object-cover rounded-2xl"
                                style={{ aspectRatio: '400 / 250', objectFit: 'cover' }}
                            />
                            <h3 className="text-xl font-semibold text-[#0f0f0fff]" i18-id="ministries-cya">
                                {t('ministries-cya')}
                            </h3>
                            <p className="text-[#878578ff]" i18-id="ministries-cya-description">
                                {t('ministries-cya-description')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Ministries;