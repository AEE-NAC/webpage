"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Footer from "../../../components/layout/Footer";
import Header from '../../../components/layout/Header';
import TextRoll from '../../../components/specific/textroll';
import { CMSText } from '../../../components/cms/cms-text';
import { CMSImage } from '../../../components/cms/cms-image';
import { useCMS } from '../../../components/cms/cms-provider';

// Inline Icons to avoid dependency issues
const ChevronRightIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>;
const GlobeAltIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S12 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>;
const UserGroupIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 5.472m0 0a9.09 9.09 0 0 0-3.741-.479 3 3 0 0 0 4.682 2.72m.943-3.198a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 5.472m0 0a9.09 9.09 0 0 0-3.741-.479 3 3 0 0 0 4.682 2.72m.943-3.198a5.971 5.971 0 0 0-.941-3.197M12 12.75a5.995 5.995 0 0 0-5.058-5.472m0 0A9.09 9.09 0 0 0 3.209 11.23a3 3 0 0 0 4.682 2.72m7.55-10.45a9.09 9.09 0 0 0-3.741-.479 3 3 0 0 0-4.682 2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 5.472m0 0a9.09 9.09 0 0 0-3.741-.479 3 3 0 0 0 4.682 2.72m.943-3.198a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 5.472m0 0a9.09 9.09 0 0 0-3.741-.479 3 3 0 0 0 4.682 2.72m.943-3.198a5.971 5.971 0 0 0-.941-3.197" /></svg>;
const CalendarIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" /></svg>;

const Section = ({ title, children, dark = false }: { title: React.ReactNode, children: React.ReactNode, dark?: boolean }) => (
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

const Card = ({ icon, title, content }: { icon: React.ReactNode, title: React.ReactNode, content: React.ReactNode }) => (
  <motion.div 
    whileHover={{ scale: 1.03 }}
    className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl h-full flex flex-col"
  >
    <div className="text-[#981a3c] mb-6 flex justify-center">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4 text-gray-800">{title}</h3>
    <div className="text-gray-600 grow whitespace-pre-line">{content}</div>
  </motion.div>
);

const Button = ({ children }: { children: React.ReactNode }) => (
  <motion.button 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-[#981a3c] text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:bg-[#7a1530] focus:outline-none focus:ring-2 focus:ring-[#981a3c] focus:ring-offset-2 shadow-lg hover:shadow-xl"
  >
    {children}
  </motion.button>
);

export default function MinistersPage() {
  // Access dictionary for TextRoll array strings which cannot use CMSText component directly
  const { dictionary } = useCMS();
  const rollWords = [
    dictionary['about.header.roll.word1'] || 'enfant',
    dictionary['about.header.roll.word2'] || 'nation',
    dictionary['about.header.roll.word3'] || 'jour'
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <header className="relative w-full min-h-screen">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <CMSImage 
            k="about.header.bg_image"
            defaultSrc="/images/font_3.jpg" 
            alt="Background"
            className="w-full h-full object-cover"
            fill
          />
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(152, 26, 60, 0.3) 0%, rgba(152, 26, 60, 0.95) 70%)',
            }}
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex items-center justify-center w-full min-h-screen py-12 px-4">
          <div className="container max-w-7xl text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white"
            >
              <span className="block mb-4"><CMSText k="about.header.prefix" defaultVal="Chaque" /></span>
              <span className="text-5xl md:text-7xl lg:text-8xl text-yellow-400">
                <TextRoll words={rollWords} />
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl font-light max-w-3xl mx-auto text-white"
            >
              <CMSText k="about.header.subtitle" defaultVal="Une mission divine pour atteindre et transformer des vies." />
            </motion.p>
          </div>
        </div>
      </header>

      <Section title={<CMSText k="about.mission.title" defaultVal="Notre Mission" />}>
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-gray-700 text-lg md:text-xl leading-relaxed mb-12"
          >
            <CMSText k="about.mission.content" defaultVal="L'Association pour l'Évangélisation des Enfants est une organisation mondiale centrée sur la Bible, composée de croyants nés de nouveau dont le but est d'évangéliser les garçons et les filles avec l'évangile du Seigneur Jésus-Christ et de les établir dans la parole de Dieu et dans une église locale pour vivre leur vie chrétienne." />
          </motion.p>
          <Button><CMSText k="about.mission.cta" defaultVal="En savoir plus" /></Button>
        </div>
      </Section>

      <Section title={<CMSText k="about.vision.title" defaultVal="Notre Vision" />} dark>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <Card 
            icon={<UserGroupIcon className="w-12 h-12" />}
            title={<CMSText k="about.vision.card1.title" defaultVal="Chaque enfant" />}
            content={<CMSText k="about.vision.card1.desc" defaultVal={"Dieu a donné à son peuple une mission claire – celle d’atteindre chaque créature avec la Bonne Nouvelle du Seigneur Jésus-Christ. Notre mission spéciale à l’AEE est d'évangéliser chaque enfant. L’AEE s'est engagée à croitre à un rythme de 15 % de plus chaque année.\n\nMarc 16 :15, « Puis il leur dit : Allez par tout le monde et prêchez la bonne nouvelle à toute la création »."} />}
          />
          <Card 
            icon={<GlobeAltIcon className="w-12 h-12" />}
            title={<CMSText k="about.vision.card2.title" defaultVal="Chaque nation" />}
            content={<CMSText k="about.vision.card2.desc" defaultVal={"L’AEE est un ministère international qui œuvre dans toutes les régions du monde de manière sans cesse croissante.\n\nMatthieu 28 :19, « Allez faites de toutes les nations des disciples, les baptisant au nom du Père, du fils et du Saint Esprit. »."} />}
          />
          <Card 
            icon={<CalendarIcon className="w-12 h-12" />}
            title={<CMSText k="about.vision.card3.title" defaultVal="Chaque jour" />}
            content={<CMSText k="about.vision.card3.desc" defaultVal={"Nous nous sommes engagés conduire les enfants à se plonger chaque jour dans la Parole de Dieu.\n\nPsaume 119 :2, « Heureux ceux qui gardent ses préceptes, et qui le recherchent de tout le cœur. »\n\nCe n'est que lorsque nous faisons confiance à Dieu et que nous l'invoquons que nous sommes en mesure d'accomplir sa volonté."} />}
          />
        </div>
      </Section>

      <Section title={<CMSText k="about.strategy.title" defaultVal="Notre Stratégie" />}>
        <div className="space-y-12">
          {[
            {
              id: 1,
              titleDefault: "La formation",
              contentDefault: "Ce que veut l'AEE, c'est atteindre les enfants du monde entier avec l'Evangile par le biais de missionnaires formés. L'AEE dispose d'un vaste programme de formation..."
            },
            {
              id: 2,
              titleDefault: "Fourniture de supports pédagogiques",
              contentDefault: "Pour atteindre efficacement les enfants, les enseignants ont besoin de matériels..."
            },
            {
              id: 3,
              titleDefault: "Assistance",
              contentDefault: "La politique financière est de « demander à Dieu et de le dire à son peuple »..."
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center space-x-8"
            >
              <div className="shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <ChevronRightIcon className="w-8 h-8 text-[#981a3c]" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                    <CMSText k={`about.strategy.item${item.id}.title`} defaultVal={item.titleDefault} />
                </h3>
                <p className="text-gray-600 text-lg">
                    <CMSText k={`about.strategy.item${item.id}.content`} defaultVal={item.contentDefault} />
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section title={<CMSText k="about.values.title" defaultVal="Nos Valeurs" />} dark>
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
              <p className="text-white font-medium text-lg">
                  <CMSText k={`about.values.item${index+1}`} defaultVal={value} />
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section title={<CMSText k="about.history.title" defaultVal="Notre Histoire" />}>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:w-1/2"
          >
            <CMSImage 
                k="about.history.image"
                defaultSrc="/placeholder.svg?height=500&width=500" 
                alt="Jesse Irvin Overholttzer" 
                className="rounded-3xl shadow-2xl w-full" 
                width={500}
                height={500}
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:w-1/2"
          >
            <h3 className="text-3xl font-bold mb-6 text-gray-800">
                <CMSText k="about.history.person_name" defaultVal="Jesse Irvin Overholtzer" />
            </h3>
            <div className="text-gray-600 mb-4 text-lg space-y-4">
                <CMSText as="p" k="about.history.p1" defaultVal="En 1937, Jesse Irvin Overholtzer, un homme de 60 ans, a fondé Child Evangelism Fellowship (CEF). Ayant grandi dans une famille religieuse, il a compris l'évangile à un jeune âge, mais sa mère lui a dit qu'il était trop jeune pour être sauvé. Plus tard, au collège, il s'est converti, mais il a regretté les années perdues." />
                <CMSText as="p" k="about.history.p2" defaultVal="M. Overholtzer a été pasteur pendant plusieurs années, mais la lecture d'un sermon de Charles Spurgeon a changé sa vie. Spurgeon a dit : « Un enfant de 5 ans, s'il est bien instruit, peut croire et être régénéré autant qu'un adulte »." />
                <CMSText as="p" k="about.history.p3" defaultVal="Aujourd'hui, l'AEE est présente dans la plupart des pays du monde, poursuivant la vision de son fondateur d'atteindre chaque enfant." />
            </div>
          </motion.div>
        </div>
      </Section>
      <Footer />
    </div>
  );
}