"use client";

import React, { useState } from 'react';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { supabase } from '../../../services/supabase.conf';
import { CMSText } from '../../../components/cms/cms-text';
import { motion } from 'framer-motion';

const ImpliquezVous = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    churchName: '',
    country: '',
    address: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.info(`[Form] Application: Envoi d'une candidature pour le rôle "${selectedRole}"...`);
    setLoading(true);
    try {
      const { error } = await supabase
        .from('applications')
        .insert([{ 
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          church_name: formData.churchName,
          country: formData.country,
          address: formData.address,
          message: formData.message,
          role: selectedRole 
        }] as any);

      if (error) {
        console.error("[Form] Application: Échec de l'insertion:", error.message);
        alert('Error submitting application. Please try again.');
      } else {
        console.info("[Form] Application: Soumission réussie.");
        alert('Application submitted successfully!');
        setShowModal(false);
        setFormData({ 
          firstName: '', 
          lastName: '', 
          email: '', 
          phone: '', 
          churchName: '', 
          country: '', 
          address: '', 
          message: '' 
        });
      }
    } catch (error: any) {
      console.error("[Form] Application: Erreur fatale:", error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      id: "create_club",
      titleDefault: "Créer un Club",
      descriptionDefault: "Ouvrez les portes de l'Evangile dans votre quartier ou école en créant un Club de la Bonne Nouvelle ou un Club de 5 Jours.",
      buttonTextDefault: "Démarrer un projet",
      icon: "🏫"
    },
    {
      id: "prayer_cell",
      titleDefault: "Cellule de Prière",
      descriptionDefault: "Rejoignez notre réseau d'intercession pour soutenir spirituellement la mission auprès des enfants dans votre région.",
      buttonTextDefault: "Rejoindre la cellule",
      icon: "🙏"
    },
    {
      id: "volunteers",
      titleDefault: "Volontaires",
      descriptionDefault: "Bénévoles, moniteurs et formateurs. Votre aide est précieuse pour l'impact local !",
      buttonTextDefault: "Postuler",
      icon: "🤝"
    },
    {
      id: "fulltime",
      titleDefault: "Ouvriers à temps plein",
      descriptionDefault: "Faites partie intégrante de notre équipe et contribuez pleinement à notre mission mondiale.",
      buttonTextDefault: "Voir les offres",
      icon: "👔"
    },
    {
      id: "parttime",
      titleDefault: "Ouvriers à temps partiel",
      descriptionDefault: "Travaillez avec nous de manière flexible et adaptée à votre emploi du temps.",
      buttonTextDefault: "Postuler",
      icon: "🕒"
    },
  ];

  const handleApply = (title: string) => {
    setSelectedRole(title);
    setShowModal(true);
  };

  return (
    <>
      <Header />
      <div className="bg-[#fdfff4ff] py-32 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-extrabold mb-6 text-[#981a3c]">
              <CMSText k="implicate.header.title" defaultVal="Agissez à nos côtés" />
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-zinc-600 leading-relaxed">
              <CMSText k="implicate.header.desc" defaultVal="Que ce soit par l'action directe sur le terrain ou par le soutien spirituel, votre engagement transforme des générations." />
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {cards.map((card, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl p-10 shadow-2xl shadow-zinc-200/50 border border-zinc-100 flex flex-col items-center text-center group"
              >
                <div className="w-20 h-20 bg-[#981a3c]/10 rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:bg-[#981a3c] group-hover:text-white transition-colors duration-500">
                  {card.icon}
                </div>
                <h2 className="font-bold text-3xl mb-4 text-zinc-900">
                  <CMSText k={`implicate.role.${card.id}.title`} defaultVal={card.titleDefault} />
                </h2>
                <p className="text-zinc-500 text-lg mb-10 leading-relaxed">
                  <CMSText k={`implicate.role.${card.id}.desc`} defaultVal={card.descriptionDefault} />
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-auto w-full bg-[#981a3c] text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg shadow-[#981a3c]/20"
                  onClick={() => handleApply(card.titleDefault)}
                >
                  <CMSText k={`implicate.role.${card.id}.btn`} defaultVal={card.buttonTextDefault} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-9999"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#981a3c]">
                  <CMSText k="implicate.modal.title_prefix" defaultVal="Engagement" /> : {selectedRole}
              </h2>
              <p className="text-sm text-zinc-500 mt-1">Veuillez remplir les informations ci-dessous.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1"><CMSText k="implicate.modal.form.first_name" defaultVal="Prénom" /></label>
                  <input
                    type="text"
                    required
                    className="w-full p-2.5 border rounded-xl text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-[#981a3c] outline-none transition-all"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1"><CMSText k="implicate.modal.form.last_name" defaultVal="Nom" /></label>
                  <input
                    type="text"
                    required
                    className="w-full p-2.5 border rounded-xl text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-[#981a3c] outline-none transition-all"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1"><CMSText k="implicate.modal.form.email" defaultVal="Email" /></label>
                  <input
                    type="email"
                    required
                    className="w-full p-2.5 border rounded-xl text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-[#981a3c] outline-none transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1"><CMSText k="implicate.modal.form.phone" defaultVal="Téléphone" /></label>
                  <input
                    type="tel"
                    required
                    className="w-full p-2.5 border rounded-xl text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-[#981a3c] outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1"><CMSText k="implicate.modal.form.church" defaultVal="Nom de l'église" /></label>
                <input
                  type="text"
                  className="w-full p-2.5 border rounded-xl text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-[#981a3c] outline-none transition-all"
                  value={formData.churchName}
                  onChange={(e) => setFormData({...formData, churchName: e.target.value})}
                  placeholder="Ex: Église Biblique de..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1"><CMSText k="implicate.modal.form.country" defaultVal="Pays" /></label>
                  <input
                    type="text"
                    required
                    className="w-full p-2.5 border rounded-xl text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-[#981a3c] outline-none transition-all"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1"><CMSText k="implicate.modal.form.address" defaultVal="Adresse" /></label>
                  <input
                    type="text"
                    className="w-full p-2.5 border rounded-xl text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-[#981a3c] outline-none transition-all"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1"><CMSText k="implicate.modal.form.message" defaultVal="Message additionnel" /></label>
                <textarea
                  className="w-full p-2.5 border rounded-xl text-zinc-900 bg-zinc-50 focus:ring-2 focus:ring-[#981a3c] outline-none transition-all h-24 resize-none"
                  value={formData.message}
                  placeholder="Dites-nous en plus sur vos motivations..."
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 text-zinc-600 font-bold hover:bg-zinc-100 rounded-xl transition-all"
                >
                  <CMSText k="implicate.modal.btn_cancel" defaultVal="Annuler" />
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#981a3c] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#7a1531] disabled:opacity-50 shadow-lg shadow-[#981a3c]/20 transition-all"
                >
                  {loading ? <CMSText k="implicate.modal.btn_sending" defaultVal="Envoi..." /> : <CMSText k="implicate.modal.btn_send" defaultVal="Envoyer" />}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      <Footer />
    </>
  );
};

export default ImpliquezVous;