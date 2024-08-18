import React from 'react';

const HeroSection = () => {
    return (
        <>
        <section className=" text-white py-7 px-4 flex flex-rows bg-transparent">
            <div className="w-2/3  container mx-auto px-4 text-black" >
                <div className="text-left mb-12">
                    <h1 className=" sm:text-[2em]  text-[3.378em]  md:text-[5.2em] lg:text-[3.3em] font-900 mb-4">Trouver une Plateforme en Ligne Polyvalente pour le Divertissement, les Affaires, le Shopping et Plus Encore : Un Défi</h1>
                    <p className="text-lg md:text-[1.8em] mb-6 font-thin lg:text-[1.5em] ">Explorez notre plateforme révolutionnaire qui offre une gamme complète de services conçus pour transformer votre expérience en ligne et simplifier vos activités numériques.</p>
                    <button className=" bg-[#00bfff] h-16  text-white py-2 px-6 rounded-[20px] text-xl ">Commencez gratuitement</button>
                </div>
                <div className="text-left mt-12">
                    <p className="text-gray-400 text-xl">12+ Active Store • 10k+ Daily user</p>
                </div>
            </div>
            <div style={{width:'60%'}}  className="h-full justify-center  relative flex ">
                          <img src='/images/desing-pres@1x.png'style={{width:'70%',height:'70%'}} />  
                </div>
        </section>
        </>
    );
};


export default HeroSection;
