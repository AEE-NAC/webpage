import React from 'react';

const Blog = () => {
  return (
    <section id="blog" className="bg-[#fdfff4ff] w-full flex justify-center  px-[26px] py-12 md:py-24 lg:py-32">
      <div className="container">
        <div className="space-y-4 text-center">
          <div className="inline-block rounded-full bg-[#f2e288] px-4 py-1 text-sm text-[#0f0f0fff]">
            Du Blog
          </div>
          <h2 className="text-3xl font-bold text-[#0f0f0fff]">Histoires Inspirantes, Insights Élevateurs</h2>
          <p className="text-[#878578ff]">
            Restez informé des dernières nouvelles, histoires et mises à jour de l'Espoir des Enfants.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div
            className="text-card-foreground shadow-sm bg-[#fdfff4ff] border border-[#878578ff] rounded-2xl overflow-hidden"
            data-v0-t="card"
          >
            <img
              src="/placeholder.svg"
              width="400"
              height="250"
              alt="Article de Blog 1"
              className="w-full h-48 object-cover"
              style={{ aspectRatio: '400 / 250', objectFit: 'cover' }}
            />
            <div className="p-6 space-y-2">
              <div className="inline-block rounded-full bg-[#f2e288] px-4 py-1 text-sm text-[#0f0f0fff]">
                Éducation
              </div>
              <h3 className="text-xl font-semibold text-[#0f0f0fff]">Empowerment de la Prochaine Génération</h3>
              <p className="text-[#878578ff]">
                Apprenez comment nos programmes d'éducation transforment les vies des enfants défavorisés.
              </p>
              <a className="inline-flex items-center gap-2 text-[#D8394D] hover:underline" href="#" rel="ugc">
                Lire Plus
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
          <div
            className="text-card-foreground shadow-sm bg-[#fdfff4ff] border border-[#878578ff] rounded-2xl overflow-hidden"
            data-v0-t="card"
          >
            <img
              src="/placeholder.svg"
              width="400"
              height="250"
              alt="Article de Blog 2"
              className="w-full h-48 object-cover"
              style={{ aspectRatio: '400 / 250', objectFit: 'cover' }}
            />
            <div className="p-6 space-y-2">
              <div className="inline-block rounded-full bg-[#f2e288] px-4 py-1 text-sm text-[#0f0f0fff]">
                Soins de Santé
              </div>
              <h3 className="text-xl font-semibold text-[#0f0f0fff]">Fournir des Soins Médicaux Essentiels</h3>
              <p className="text-[#878578ff]">
                Découvrez comment nos initiatives de santé améliorent les vies des enfants en difficulté.
              </p>
              <a className="inline-flex items-center gap-2 text-[#D8394D] hover:underline" href="#" rel="ugc">
                Lire Plus
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
          <div
            className="text-card-foreground shadow-sm bg-[#fdfff4ff] border border-[#878578ff] rounded-2xl overflow-hidden"
            data-v0-t="card"
          >
            <img
              src="/placeholder.svg"
              width="400"
              height="250"
              alt="Article de Blog 3"
              className="w-full h-48 object-cover"
              style={{ aspectRatio: '400 / 250', objectFit: 'cover' }}
            />
            <div className="p-6 space-y-2">
              <div className="inline-block rounded-full bg-[#f2e288] px-4 py-1 text-sm text-[#0f0f0fff]">
                Guidance Spirituelle
              </div>
              <h3 className="text-xl font-semibold text-[#0f0f0fff]">Nourrir l'Âme, Élever l'Esprit</h3>
              <p className="text-[#878578ff]">
                Explorez comment nos programmes spirituels aident les enfants à trouver de l'espoir et de l'inspiration.
              </p>
              <a className="inline-flex items-center gap-2 text-[#D8394D] hover:underline" href="#" rel="ugc">
                Lire Plus
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;