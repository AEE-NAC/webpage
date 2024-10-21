import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRightIcon, GlobeAltIcon, UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Footer from "../components/layout/Footer"
import Header from '../components/layout/Header';
const Section = ({ title, children, dark = false }) => (
  <section className={dark ? 'bg-gray-900 text-white py-24' : 'bg-white py-24'}>
    <div className="container mx-auto px-4">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold mb-12 text-center"
      >
        {title}
      </motion.h2>
      {children}
    </div>
  </section>
);

const Card = ({ icon, title, content }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className="bg-white rounded-3xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl"
  >
    <div className="text-blue-600 mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h3>
    <p className="text-gray-600">{content}</p>
  </motion.div>
);

const Button = ({ children }) => (
  <motion.button 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-blue-600 text-white px-8 py-4 rounded-full font-medium text-lg transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    {children}
  </motion.button>
);

export default function MinistersPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
        <Header></Header>
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-24 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Ministers
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl font-light max-w-3xl mx-auto"
          >
            Inspirant la prochaine génération à travers la foi et l'éducation
          </motion.p>
        </div>
      </header>

      <Section title="Notre Mission">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-medium text-blue-600 mb-8"
          >
            « Chaque enfant, chaque nation, chaque jour. »
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 mb-12 text-lg"
          >
            L'Association pour l'Évangélisation des Enfants est une organisation mondiale centrée sur la Bible, composée de croyants nés de nouveau dont le but est d'évangéliser les garçons et les filles avec l'évangile du Seigneur Jésus-Christ et de les établir (disciples) dans la parole de Dieu et dans une église locale pour vivre leur vie chrétienne.
          </motion.p>
          <Button>En savoir plus</Button>
        </div>
      </Section>

      <Section title="Notre Vision" dark>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <Card 
            icon={<UserGroupIcon className="w-12 h-12" />}
            title="Chaque enfant" 
            content="Nous nous engageons à atteindre chaque enfant avec la Bonne Nouvelle du Seigneur Jésus-Christ, en croissant de 15% chaque année."
          />
          <Card 
            icon={<GlobeAltIcon className="w-12 h-12" />}
            title="Chaque nation" 
            content="L'AEE est un ministère international qui œuvre dans toutes les régions du monde de manière sans cesse croissante."
          />
          <Card 
            icon={<CalendarIcon className="w-12 h-12" />}
            title="Chaque jour" 
            content="Nous nous sommes engagés à conduire les enfants à se plonger chaque jour dans la Parole de Dieu pour développer un caractère pieux."
          />
        </div>
      </Section>

      <Section title="Notre Stratégie">
        <div className="space-y-12">
          {[
            {
              title: "La formation",
              content: "Nous offrons un vaste programme de formation pour les chrétiens impliqués dans l'évangélisation des enfants."
            },
            {
              title: "Fourniture de supports pédagogiques",
              content: "Nous fournissons des matériels de qualité pour évangéliser efficacement les enfants."
            },
            {
              title: "Assistance",
              content: "Nous soutenons les missionnaires de l'AEE dans le besoin pour permettre au ministère de continuer à s'épanouir."
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center space-x-8"
            >
              <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <ChevronRightIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section title="Nos Valeurs" dark>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            "L'importance du leadership pieux à tous les niveaux",
            "L'importance du bien-être spirituel de nos travailleurs",
            "L'importance de la prière en tant que Fondation",
            "L'importance de l'évangélisation des enfants",
            "L'importance d'une présentation claire et biblique de l'Évangile",
            "L'importance d'un engagement pour l'excellence, pour la gloire de Dieu"
          ].map((value, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl"
            >
              <p className="text-white font-medium text-lg">{value}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section title="Notre Histoire">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:w-1/2"
          >
            <img src="/placeholder.svg?height=500&width=500" alt="Jesse Irvin Overholttzer" className="rounded-3xl shadow-2xl" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:w-1/2"
          >
            <h3 className="text-3xl font-bold mb-6 text-gray-800">Jesse Irvin Overholtzer</h3>
            <p className="text-gray-600 mb-4 text-lg">
              L'AEE a été fondée par Jesse Irvin Overholtzer en 1937. Ayant grandi dans une famille religieuse, Jesse a été convaincu de son propre péché à l'âge de 12 ans et a demandé conseil à sa mère. Celle-ci lui a répondu : « Mon fils, tu es trop jeune ».
            </p>
            <p className="text-gray-600 mb-4 text-lg">
              Ce n'est qu'à l'université que Jesse Overholtzer a entendu l'Évangile et a accepté Christ comme son Sauveur. Plus tard, en tant que pasteur, M. Overholtzer a lu un sermon de Charles Spurgeon qui disait : « Un enfant de cinq ans, s'il est correctement instruit, peut croire et être régénéré aussi véritablement qu'un adulte ».
            </p>
            <p className="text-gray-600 text-lg">
              Le Seigneur a utilisé cette déclaration dans la vie de M. O pour l'amener à commencer le ministère de l'Association pour l'Évangélisation des Enfants à l'âge de 60 ans. Ce ministère est devenu la plus importante mission d'évangélisation auprès des enfants dans le monde.
            </p>
          </motion.div>
        </div>
      </Section>
           <Footer></Footer>
    </div>
  );
}