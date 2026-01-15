import React from 'react';
import { CMSText } from '../cms/cms-text';
import { CMSImage } from '../cms/cms-image';

const WeeklySection = () => {
  return (
    <section className="container px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold">
            <CMSText k="home.weekly_misc.word_title" defaultVal="Word of the Week" />
          </h2>
          <div className="flex items-center gap-4">
            <div className="bg-[#981a3c] rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold text-white shrink-0">
              <CMSText k="home.weekly_misc.verse_ref_short" defaultVal="JN" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                <CMSText k="home.weekly_misc.verse_ref_long" defaultVal="John 3:16" />
              </h3>
              <p className="text-muted-foreground text-zinc-600 dark:text-zinc-400">
                "<CMSText k="home.weekly_misc.verse_text" defaultVal="For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." />"
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold">
            <CMSText k="home.featured_articles.title" defaultVal="Featured Articles" />
          </h2>
          <div className="grid gap-4">
            <a className="group flex items-center gap-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg p-3 transition-colors" href="#">
              <CMSImage
                k="home.featured_articles.art1.image"
                defaultSrc="/sequ.jpg"
                width={64}
                height={64}
                alt="Article Thumbnail"
                className="rounded-lg object-cover w-16 h-16"
              />
              <div>
                <h3 className="text-lg font-semibold group-hover:underline">
                  <CMSText k="home.featured_articles.art1.title" defaultVal="The Power of Prayer" />
                </h3>
                <p className="text-muted-foreground text-zinc-600 dark:text-zinc-400 line-clamp-2 text-sm">
                  <CMSText k="home.featured_articles.art1.desc" defaultVal="Discover the transformative impact of prayer in your daily life." />
                </p>
              </div>
            </a>
            <a className="group flex items-center gap-4 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg p-3 transition-colors" href="#">
              <CMSImage
                k="home.featured_articles.art2.image"
                defaultSrc="/sequ.jpg"
                width={64}
                height={64}
                alt="Article Thumbnail"
                className="rounded-lg object-cover w-16 h-16"
              />
              <div>
                <h3 className="text-lg font-semibold group-hover:underline">
                    <CMSText k="home.featured_articles.art2.title" defaultVal="Navigating Life's Challenges" />
                </h3>
                <p className="text-muted-foreground text-zinc-600 dark:text-zinc-400 line-clamp-2 text-sm">
                    <CMSText k="home.featured_articles.art2.desc" defaultVal="Practical guidance for overcoming obstacles and finding peace." />
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturedBooks = () => {
    return (
      <section className="container px-4 md:px-6 py-8">
        <div className="bg-card dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold">
            <CMSText k="home.featured_books.title" defaultVal="Featured Books" />
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <a key={i} className="group flex flex-col items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg p-3 transition-colors" href="#">
                  <CMSImage
                    k={`home.featured_books.book${i}.cover`}
                    defaultSrc="/sequ.jpg"
                    width={120}
                    height={160}
                    alt="Book Cover"
                    className="rounded-lg object-cover w-[120px] h-[160px]"
                  />
                  <h3 className="text-lg font-semibold group-hover:underline text-center">
                    <CMSText k={`home.featured_books.book${i}.title`} defaultVal={i === 1 ? "The Pursuit of God" : i === 2 ? "Mere Christianity" : i === 3 ? "The Screwtape Letters" : "The Cost of Discipleship"} />
                  </h3>
                  <p className="text-muted-foreground text-zinc-500 text-sm text-center">
                    <CMSText k={`home.featured_books.book${i}.author`} defaultVal={i % 2 !== 0 ? "A.W. Tozer" : "C.S. Lewis"} />
                  </p>
                </a>
            ))}
          </div>
        </div>
      </section>
    );
  };
  

const UpcomingEvents = () => {
  return (
    <section className="container px-4 md:px-6 py-8">
      <div className="bg-card dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-bold">
            <CMSText k="home.events.title" defaultVal="Upcoming Events" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <a key={i} className="group flex flex-col gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg p-4 transition-colors" href="#">
                <div className="bg-[#981a3c] rounded-lg p-3 text-white flex items-center justify-center w-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                </div>
                <h3 className="text-lg font-semibold group-hover:underline">
                    <CMSText k={`home.events.ev${i}.title`} defaultVal={i===1?"Bible Study Group":i===2?"Worship Night":"Youth Retreat"} />
                </h3>
                <p className="text-muted-foreground text-zinc-600 dark:text-zinc-400 text-sm">
                    <CMSText k={`home.events.ev${i}.desc`} defaultVal="Join us for this special event." />
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground text-zinc-500 mt-auto pt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                    <span><CMSText k={`home.events.ev${i}.date`} defaultVal="Coming Soon" /></span>
                </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const TrainingSection = () => {
  return (
    <section className="container px-4 md:px-6 py-8">
      <div className="bg-card dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-bold">
            <CMSText k="home.training.title" defaultVal="Training & Formation" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
                <a key={i} className="group flex flex-col gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg p-4 transition-colors" href="#">
                    <div className="bg-[#981a3c] rounded-lg p-3 text-white flex items-center justify-center w-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                    </div>
                    <h3 className="text-lg font-semibold group-hover:underline">
                        <CMSText k={`home.training.tr${i}.title`} defaultVal="Workshop Title" />
                    </h3>
                    <p className="text-muted-foreground text-zinc-600 dark:text-zinc-400 text-sm">
                        <CMSText k={`home.training.tr${i}.desc`} defaultVal="Description of the training session." />
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground text-zinc-500 mt-auto pt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
                        <span><CMSText k={`home.training.tr${i}.time`} defaultVal="By appointment" /></span>
                    </div>
                </a>
            ))}
        </div>
      </div>
    </section>
  );
};

const NewsSection = () => {
  return (
    <section className="container px-4 md:px-6 py-8">
      <div className="bg-card dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-bold">
            <CMSText k="home.news.title" defaultVal="News & Updates" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a className="group flex flex-col gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg p-4 transition-colors" href="#">
            <CMSImage
              k="home.news.item1.image"
              defaultSrc="/sequ.jpg"
              width={240}
              height={160}
              alt="News Thumbnail"
              className="rounded-lg object-cover w-full h-[160px]"
            />
            <h3 className="text-lg font-semibold group-hover:underline">
                <CMSText k="home.news.item1.title" defaultVal="Announcing New Outreach Program" />
            </h3>
            <p className="text-muted-foreground text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2">
                <CMSText k="home.news.item1.desc" defaultVal="We're excited to launch our new outreach program, designed to serve the local community." />
            </p>
          </a>
        </div>
      </div>
    </section>
  );
};

export { WeeklySection, FeaturedBooks, UpcomingEvents, TrainingSection, NewsSection };
