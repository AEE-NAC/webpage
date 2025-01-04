import React from 'react';

const Ministries = () => (
  <section id="ministries" className="bg-[#fdfff4ff] py-12 md:py-24 lg:py-32">
    <div className="container">
      <div className="space-y-4 text-center">
        <div className="inline-block rounded-full bg-[#d8ae34ff] px-4 py-1 text-sm text-[#0f0f0fff]">
          Nos Ministères
        </div>
        <h2 className="text-3xl font-bold text-[#0f0f0fff]">Transformer les Vies par Nos Ministères</h2>
        <p className="text-[#878578ff]">
          L'Espoir des Enfants propose une variété de ministères pour soutenir les enfants défavorisés et leurs familles.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 p-6">
        <div
          className="text-card-foreground shadow-sm bg-[#fdfff4ff] border border-[#878578ff] rounded-2xl overflow-hidden"
          data-v0-t="card"
        >
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-semibold text-[#0f0f0fff]">Découvrez Nos Missions Transformatrices</h3>
            <p className="text-[#878578ff]">
              Rencontre les enfants là où ils sont, dans les écoles, les centres communautaires, les églises et les foyers de quartier. Les enseignants sont formés et équipés pour animer des clubs de Bonnes Nouvelles chaque semaine, offrant les vérités intemporelles de la Bible de manière passionnante et engageante. Les enfants apprennent l'Évangile, et beaucoup en viennent à connaître Jésus comme leur Sauveur.
            </p>
          </div>
        </div>
        <div
          className="text-card-foreground shadow-sm bg-[#fdfff4ff] border border-[#878578ff] rounded-2xl overflow-hidden"
          data-v0-t="card"
        >
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-semibold text-[#0f0f0fff]">Club de 5 Jours</h3>
            <p className="text-[#878578ff]">
              Situé dans leur quartier, un club de 5 jours est facile pour un enfant d'avoir accès lors de sa pause estivale. Les enseignants sont formés et équipés pour diriger des clubs de 5 jours remplis d'action pendant une semaine solide, fournissant les vérités intemporelles de la Bible de manière passionnante et engageante. Les enfants apprennent l'Évangile, et beaucoup en viennent à connaître Jésus comme leur Sauveur.
            </p>
          </div>
        </div>
        <div
          className="text-card-foreground shadow-sm bg-[#fdfff4ff] border border-[#878578ff] rounded-2xl overflow-hidden"
          data-v0-t="card"
        >
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-semibold text-[#0f0f0fff]">CYA - Jeunes Chrétiens en Action</h3>
            <p className="text-[#878578ff]">
              CYA est un programme conçu pour vous former, vous et une équipe d'autres jeunes, à des manières efficaces et engageantes d'enseigner Dieu aux enfants. Vous participerez à une école de formation d'une à deux semaines où vous apprendrez à présenter clairement l'Évangile au niveau d'un enfant, à conseiller un enfant pour le salut et à diriger un ministère dynamique de club pour les enfants. Les éléments de ce club comprennent l'enseignement d'une leçon biblique, d'une histoire missionnaire réelle et d'un verset biblique, ainsi que des chants, des jeux et un temps de révision amusant.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Ministries;