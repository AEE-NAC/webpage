import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
const ImpliquezVous = () => {
  const cards = [
    {
      title: "Visiteurs",
      description: "Découvrez notre communauté et nos activités lors de votre première visite.",
      buttonText: "En savoir plus"
    },
    {
      title: "Membres",
      description: "Rejoignez-nous et profitez de tous les avantages offerts à nos membres.",
      buttonText: "Devenir membre"
    },
    {
      title: "Volontaires",
      description: "Moniteurs associés, Supporteurs, Formateurs, Membres CA. Votre aide est précieuse !",
      buttonText: "Postuler"
    },
    {
      title: "Ouvriers à temps plein",
      description: "Faites partie intégrante de notre équipe et contribuez pleinement à notre mission.",
      buttonText: "Voir les offres"
    },
    {
      title: "Ouvriers à temps partiel",
      description: "Travaillez avec nous de manière flexible et adaptée à votre emploi du temps.",
      buttonText: "Postuler"
    },
  ];

  return (
    <>
    <Header></Header>
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#981a3c]">Impliquez-vous</h1>
        <p className="text-center text-xl mb-12 max-w-3xl mx-auto text-gray-600">
          Rejoignez notre communauté dynamique et faites la différence. Que vous soyez visiteur, membre ou bénévole, il y a une place pour vous !
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg transition duration-300 ease-in-out hover:shadow-2xl transform hover:-translate-y-1">
              <div className="p-6">
                <h2 className="font-bold text-2xl mb-4 text-[#981a3c]">{card.title}</h2>
                <p className="text-gray-700 text-base mb-6">{card.description}</p>
                <button className="bg-[#981a3c] hover:bg-[#981a3c] text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                  {card.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer></Footer>
    </>
  );
};

export default ImpliquezVous;