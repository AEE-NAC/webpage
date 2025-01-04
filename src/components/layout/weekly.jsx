import React from 'react';

const WeeklyWord = () => {
  return (
    <section id="weekly-word" className="px-[26px] w-full flex justify-center  py-12 md:py-24 lg:py-32">
      <div className="container p-6 rounded-[12px] bg-[#423c5eff] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-block rounded-full bg-[#f2e288] px-4 py-1 text-sm text-[#0f0f0fff]">Mot de la Semaine</div>
          <h2 className="text-3xl font-bold text-[#fdfff4ff]">Qu'est-ce que le FRET ? Comment le définiriez-vous ? Connaissez-vous quelqu'un qui en est coupable ? Cette personne est-elle vous ?</h2>
          <p className="text-[#bdbdbcff]">
            Le FRET est plus courant que vous ne le pensez, même parmi les vrais disciples du Christ. La première question que j'ai posée appelle une réponse de votre part. L'INQUIETUDE est définie comme suit : être anxieux, tourmenté, irritable, contrarié, vexé ou malheureux à propos de quelque chose qui vous ronge. L'angoisse est à votre esprit ce que l'acide est au métal. C'est quelque chose dans votre esprit qui vous ronge comme une bactérie mangeuse de chair le ferait avec votre peau.
          </p>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Lire Plus
          </button>
        </div>
        <div>
          <img
            src="/images/CBN_haiti.jpeg"
            width="600"
            height="400"
            alt="Image du Mot de la Semaine"
            className="rounded-2xl w-full object-cover"
            style={{ aspectRatio: '600 / 400', objectFit: 'cover' }}
          />
        </div>
      </div>
    </section>
  );
};

export default WeeklyWord;