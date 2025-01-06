import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRightIcon, GlobeAltIcon, UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline';
import Footer from "../components/layout/Footer"
import Header from '../components/layout/Header';
import TextRoll from '../components/specific/textroll';
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
    <div className="text-[#981a3c] mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h3>
    <p className="text-gray-600">{content}</p>
  </motion.div>
);

const Button = ({ children }) => (
  <motion.button 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-[#981a3c] text-white px-8 py-4 rounded-full font-medium text-lg transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    {children}
  </motion.button>
);

export default function MinistersPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
        <Header></Header>
      <header className="bg-gradient-to-r from-[#981a3c] to-[#981a3c] text-white">
        <div className="container mx-auto px-4 py-24 text-center flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl flex   md:text-7xl font-bold mb-6"
            style={{width: '35%'}}
          >
            "Every <TextRoll words={['child', 'nation', 'day']} />."
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl font-light max-w-3xl mx-auto" i18-id="apropos-sub1"
          >
          </motion.p>
        </div>
      </header>

      <Section title="Notre Mission">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 mb-12 text-lg"
            i18-id="apropos-sub2"
          >
          </motion.p>
          <Button i18-id="apropos-btn1" ></Button>
        </div>
      </Section>

      <Section title="Notre Vision" dark>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <Card 
            icon={<UserGroupIcon className="w-12 h-12" />}
            title="Chaque enfant" 
            content="Dieu a donné à son peuple une mission claire – celle d’atteindre chaque créature avec la Bonne Nouvelle du Seigneur Jésus-Christ. Notre mission spéciale à l’AEE est d'évangéliser chaque enfant. L’AEE s'est engagée à croitre à un rythme de 15 % de plus chaque année. Les choix stratégiques du ministère, tels que le Club de la Bonne Nouvelle, le Ministère Biblique dans les écoles publiques et privées, les Clubs Spéciaux tels : les Clubs de Fin d’Année, Les Clubs de Cinq jours et Club de Pâques, nous aiderons à atteindre cet objectif.

Marc 16 :15, « Puis il leur dit : Allez par tout le monde et prêchez la bonne nouvelle à toute la création ». 
 
"
          />
          <Card 
            icon={<GlobeAltIcon className="w-12 h-12" />}
            title="Chaque nation" 
            content="L’AEE est un ministère international qui œuvre dans toutes les régions du monde de manière sans cesse croissante.

Matthieu 28 :19, « Allez faites de toutes les nations des disciples, les baptisant au nom du Père, du fils et du Saint Esprit. ». 
"
          />
          <Card 
            icon={<CalendarIcon className="w-12 h-12" />}
            title="Chaque jour" 
            content="Nous nous sommes engagés conduire les enfants à se plonger chaque jour dans la Parole de Dieu. Au fur et à mesure que les enfants grandissent dans leur relation avec le Seigneur en méditant sur Sa Parole, ils développent un caractère pieux, qui produit beaucoup de fruits à la gloire de Dieu, y compris la propagation de l'Évangile à leurs pairs. 

Psaume 119 :2, « Heureux ceux qui gardent ses préceptes, et qui le recherchent de tout le cœur. »

Ce n'est que lorsque nous faisons confiance à Dieu et que nous l'invoquons que nous sommes en mesure d'accomplir sa volonté. Les programmes viennent après la prière, jamais avant. 
Nous avons plus de x ouvriers dans notre région francophone, dirigée par un directeur régional, un directeur de zone et un assistant directeur de l’éducation. Dieu travaille par l'intermédiaire de son peuple, de ses dirigeants pieux, du personnel et des volontaires pour atteindre nos objectifs. Il faudra noter qu’a travers le monde entier qu’il y a des dizaines de milliers de bénévoles est ce pourquoi il est dit que le soleil ne se couche jamais sur l’AEE. Nous dispensons des formations, équipons nos ouvriers de matériels pédagogiques pour le ministère et nous les soutenons en collectant des fonds et le développement du Ministère.
"
          />
        </div>
      </Section>

      <Section title="Notre Stratégie">
        <div className="space-y-12">
          {[
            {
              title: "La formation",
              content: `Ce que veut l'AEE, c'est atteindre les enfants du monde entier avec l'Evangile par le biais de missionnaires formés. L'AEE dispose d'un vaste programme de formation, de cours de formation hebdomadaires, de conférences, de cours de formation pour les églises, d'ateliers et d'écoles de formation offrant une formation aux chrétiens impliqués dans l'évangélisation des enfants. Les centres de formation de l’AEE (les instituts) ont lieu dans de nombreux pays, dont Haïti dans la région Créolophone et Francophone et des équipes de formateurs qualifiés se déplacent pour aider les missionnaires de l'AEE dans presque toutes les régions du monde. 
La formation du personnel de l'AEE s'étend à toutes les phases et à tous les niveaux de l'AEE`

            },
            {
              title: "Fourniture de supports pédagogiques",
              content: `Pour atteindre efficacement les enfants, les enseignants ont besoin de matériels. Beaucoup de nos moniteurs formés n'ont pas les moyens d'acheter le matériel de qualité dont ils ont besoin pour
Évangéliser efficacement les enfants. Les Ministères internationaux s'engagent à les doter des outils dont ils ont besoin pour accomplir leur tâche, qu'il s'agisse de littérature imprimée, de sites web ou d'autres médias.`

            },
            {
              title: "Assistance",
              content: `La politique financière est de « demander à Dieu et de le dire à son peuple ». Les missionnaires de l'AEE dans le monde entier monde vivent par la foi et font confiance à Dieu pour subvenir à leurs besoins. Cependant, beaucoup d'entre eux vivent dans des situations où il est impossible de commencer ou de poursuivre leur ministère en raison du manque de ressources à cause du manque de soutien indigène.  
Pour permettre au ministère de continuer à s'épanouir, nous devons soutenir les missionnaires de l'AEE qui sont dans le besoin. Grâce à des programmes tels que Sponsor-A-National (SPAN), le Quartier General International aide le ministère à se développer de manière exponentielle dans le monde entier.
`
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
                <ChevronRightIcon className="w-8 h-8 text-[#981a3c]" />
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
            <p className="text-gray-600 mb-4 text-lg" i18-id="apropos-sub3">
            </p>
            <p className="text-gray-600 mb-4 text-lg" i18-id="apropos-sub4">
              
            </p>
            <p className="text-gray-600 text-lg" i18-id="apropos-sub5">
             
            </p>
          </motion.div>
        </div>
      </Section>
           <Footer></Footer>
    </div>
  );
}