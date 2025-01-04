import React from 'react';

const Card = () => (
  <div className="bg-gray-800 p-8 rounded-lg w-full  sm:w-1/3 m-4 h-[420px]"></div>
);

const Engagements = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black py-10 text-white">
      <h2 className="text-[3.2em] font-bold text-blue-400 mb-4">
        Engagez, Connectez et Réussissez
      </h2>
      <p className="text-[1.6em] text-center text-gray-300 mb-10">
        Nous fournissons un écosystème riche avec de nombreuses applications et
        services conçus pour être ergonomiques, simples d'utilisation et
        optimisés pour atteindre des performances élevées sur n'importe quel appareil.
      </p>
      <div className="flex flex-row justify-center w-full h-full">
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
};

export default Engagements;
