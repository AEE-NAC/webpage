import React from 'react';

const WeeklyWord = () => {
  return (
    <section id="weekly-word" className=" px-[26px]   py-12 md:py-24 lg:py-32">
      <div className="container p-6 rounded-[12px] bg-[#423c5eff] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-block rounded-full bg-[#d8ae34ff] px-4 py-1 text-sm text-[#0f0f0fff]">Weekly Word</div>
          <h2 className="text-3xl font-bold text-[#fdfff4ff]">Nourishing the Soul, Inspiring the Mind</h2>
          <p className="text-[#bdbdbcff]">
            Join us each week as we delve into the Word of God, providing spiritual nourishment and guidance for
            children and their families.
          </p>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Read More
          </button>
        </div>
        <div>
          <img
            src="/images/CBN_haiti.jpeg"
            width="600"
            height="400"
            alt="Weekly Word Image"
            className="rounded-2xl w-full object-cover"
            style={{ aspectRatio: '600 / 400', objectFit: 'cover' }}
          />
        </div>
      </div>
    </section>
  );
};

export default WeeklyWord;